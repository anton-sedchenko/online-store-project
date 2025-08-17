import React, { useEffect, useMemo, useState } from "react";
import { getReviews, addReview, replyReview, deleteReview } from "../http/reviewAPI.js";
import StarRating from "./StarRating.jsx";

/**
 * Reviews
 * props:
 * - productId (number)
 * - isAuth (boolean)
 * - isAdmin (boolean)
 * - userEmail? (string) — лише для відображення "ви"
 */
export default function Reviews({ productId, isAuth, isAdmin, userEmail }) {
    const [items, setItems] = useState([]); // плаский список
    const [avg, setAvg] = useState(0);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);

    // форма нового відгуку/оцінки (top-level)
    const [newRating, setNewRating] = useState(0);
    const [newText, setNewText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const data = await getReviews(productId);
                if (!mounted) return;
                setItems(Array.isArray(data.items) ? data.items : []);
                setAvg(data?.rating?.avg || 0);
                setCount(data?.rating?.count || 0);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [productId]);

    // будуємо дерево з плаского масиву
    const tree = useMemo(() => {
        const byId = new Map();
        const roots = [];
        (items || []).forEach(r => byId.set(r.id, { ...r, children: [] }));
        (items || []).forEach(r => {
            const node = byId.get(r.id);
            if (r.parentId) {
                const p = byId.get(r.parentId);
                if (p) p.children.push(node); else roots.push(node);
            } else {
                roots.push(node);
            }
        });
        // сортуємо: новіші зверху
        const sortFn = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);
        const deepSort = (arr) => arr.sort(sortFn).map(n => ({ ...n, children: deepSort(n.children) }));
        return deepSort(roots);
    }, [items]);

    const refresh = async () => {
        const data = await getReviews(productId);
        setItems(Array.isArray(data.items) ? data.items : []);
        setAvg(data?.rating?.avg || 0);
        setCount(data?.rating?.count || 0);
    };

    const submitTop = async () => {
        if (!isAuth) return alert("Щоб залишити відгук, увійдіть у кабінет.");
        if (!newRating) return alert("Оберіть оцінку (1–5 зірок).");
        try {
            setSubmitting(true);
            await addReview({ productId, rating: newRating, text: newText.trim() });
            setNewRating(0);
            setNewText("");
            await refresh();
        } catch (e) {
            const msg = e?.response?.data?.message || e.message;
            alert(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const submitReply = async (parentId, text, after) => {
        if (!isAuth) return alert("Спершу увійдіть у кабінет.");
        if (!text.trim()) return;
        try {
            await replyReview(parentId, text.trim());
            await refresh();
            after?.();
        } catch (e) {
            alert(e?.response?.data?.message || e.message);
        }
    };

    const removeReview = async (id) => {
        if (!isAdmin) return;
        if (!confirm("Видалити коментар?")) return;
        try {
            await deleteReview(id);
            await refresh();
        } catch (e) {
            alert(e?.response?.data?.message || e.message);
        }
    };

    return (
        <section style={{ marginTop: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <h4 style={{ margin: 0 }}>Відгуки</h4>
                <span className="muted">
          (Щоб залишити відгук — увійдіть або зареєструйтесь)
        </span>
            </div>

            {/* Порожньо */}
            {!loading && tree.length === 0 && (
                <p className="muted" style={{ marginTop: 8 }}>Відгуків ще немає.</p>
            )}

            {/* Список */}
            <div style={{ marginTop: 12 }}>
                {tree.map((node) => (
                    <ReviewItem
                        key={node.id}
                        node={node}
                        isAdmin={isAdmin}
                        onReply={submitReply}
                        onDelete={removeReview}
                        userEmail={userEmail}
                    />
                ))}
            </div>

            {/* Форма топ-рівня */}
            <div style={{ marginTop: 16, borderTop: "1px solid #eee", paddingTop: 12 }}>
                <p style={{ marginBottom: 6 }}>Ваша оцінка товару:</p>
                <StarRating value={newRating} onChange={setNewRating} size={24} />
                <textarea
                    placeholder="Ваш відгук (необов'язково)"
                    className="buyer__contacts__form-input"
                    style={{ marginTop: 8, minHeight: 80 }}
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                />
                <div style={{ marginTop: 8 }}>
                    <button className="neu-btn" disabled={submitting} onClick={submitTop}>
                        Надіслати відгук
                    </button>
                </div>
            </div>

            {/* Підсумок рейтингу (видно і тут, і зверху в картці) */}
            <div style={{ marginTop: 10 }} className="muted">
                Середня оцінка: <b>{avg.toFixed(1)}</b> із 5 • відгуків: <b>{count}</b>
            </div>
        </section>
    );
}

function ReviewItem({ node, isAdmin, onReply, onDelete, userEmail }) {
    const [replyOpen, setReplyOpen] = useState(false);
    const [text, setText] = useState("");

    const isRoot = !node.parentId;
    const mineBadge = userEmail && node.user?.email && node.user.email === userEmail;

    return (
        <div style={{ marginBottom: 12 }}>
            <div
                style={{
                    background: "#fafafa",
                    border: "1px solid #eee",
                    borderRadius: 8,
                    padding: 10,
                    marginLeft: isRoot ? 0 : 24,   // один відступ для гілки
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <strong>{node.user?.name || node.user?.email || "Користувач"}</strong>
                    {mineBadge && <span className="muted">(це ви)</span>}
                    {isRoot && node.rating ? (
                        <span style={{ marginLeft: "auto" }}>
              <StarRating value={node.rating} size={16} />
            </span>
                    ) : null}
                </div>

                {node.text && <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{node.text}</div>}

                <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                    {new Date(node.createdAt).toLocaleString()}
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                    <button className="link-btn" onClick={() => setReplyOpen((s) => !s)}>Відповісти</button>
                    {isAdmin && (
                        <button className="link-btn danger" onClick={() => onDelete(node.id)}>
                            Видалити
                        </button>
                    )}
                </div>

                {replyOpen && (
                    <div style={{ marginTop: 8 }}>
                        {/* коротка цитата батьківського коментаря */}
                        {node.text && (
                            <blockquote
                                style={{
                                    margin: 0,
                                    paddingLeft: 8,
                                    borderLeft: "3px solid #ddd",
                                    color: "#666",
                                    fontSize: 13,
                                }}
                            >
                                {node.text.length > 120 ? node.text.slice(0, 120) + "…" : node.text}
                            </blockquote>
                        )}
                        <textarea
                            placeholder="Ваша відповідь…"
                            className="buyer__contacts__form-input"
                            style={{ marginTop: 6, minHeight: 70 }}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <div style={{ marginTop: 6 }}>
                            <button
                                className="neu-btn"
                                onClick={() => onReply(node.id, text, () => { setText(""); setReplyOpen(false); })}
                            >
                                Надіслати
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* діти */}
            {node.children?.length > 0 &&
                node.children.map((ch) => (
                    <ReviewItem
                        key={ch.id}
                        node={ch}
                        isAdmin={isAdmin}
                        onReply={onReply}
                        onDelete={onDelete}
                        userEmail={userEmail}
                    />
                ))}
        </div>
    );
}