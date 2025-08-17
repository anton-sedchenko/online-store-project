import React, { useEffect, useMemo, useState } from "react";
import { getReviews, addReview, replyReview, deleteReview } from "../http/reviewAPI.js";
import StarRating from "./StarRating.jsx";

/**
 * Reviews
 * props:
 * - productId (number)
 * - isAuth (boolean)
 * - isAdmin (boolean)
 * - userId? (number) — для маркування «це ви»
 */
export default function Reviews({ productId, isAuth, isAdmin, userId }) {
    const [items, setItems] = useState([]); // плаский список (root + replies)
    const [avg, setAvg] = useState(0);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);

    // єдина форма: рейтинг (опційно) + текст (опційно)
    const [newRating, setNewRating] = useState(0);
    const [newText, setNewText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!productId) return;
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

    // дерево
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
        const sortFn = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);
        const deepSort = (arr) => arr.sort(sortFn).map(n => ({ ...n, children: deepSort(n.children) }));
        return deepSort(roots);
    }, [items]);

    const refresh = async () => {
        if (!productId) return;
        const data = await getReviews(productId);
        setItems(Array.isArray(data.items) ? data.items : []);
        setAvg(data?.rating?.avg || 0);
        setCount(data?.rating?.count || 0);
    };

    // чи користувач вже ставив оцінку
    const userHasRated = useMemo(
        () => (items || []).some(r => !r.parentId && r.user?.id === userId && r.rating),
        [items, userId]
    );

    // єдине надсилання: (rating? && !userHasRated) || text?
    const submitTop = async () => {
        if (!isAuth) return alert("Щоб залишити відгук, увійдіть у кабінет.");

        const hasText = newText.trim().length > 0;
        const maySendRating = !userHasRated && newRating > 0;

        if (!hasText && !maySendRating) {
            return alert("Додайте текст або оцінку (1–5 зірок).");
        }

        try {
            setSubmitting(true);
            await addReview({
                productId,
                // якщо юзер уже оцінював — не відправляємо rating взагалі
                ...(maySendRating ? { rating: newRating } : {}),
                text: hasText ? newText.trim() : null
            });
            setNewRating(0);
            setNewText("");
            await refresh();
        } catch (e) {
            alert(e?.response?.data?.message || e.message);
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
          (Щоб лишити коментар або оцінку — увійдіть або зареєструйтесь)
        </span>
            </div>

            {!loading && tree.length === 0 && (
                <p className="muted" style={{ marginTop: 8 }}>Відгуків ще немає.</p>
            )}

            <div style={{ marginTop: 12 }}>
                {tree.map((node) => (
                    <ReviewItem
                        key={node.id}
                        node={node}
                        isAdmin={isAdmin}
                        onReply={submitReply}
                        onDelete={removeReview}
                        userId={userId}
                    />
                ))}
            </div>

            {/* ЄДИНА ФОРМА */}
            <div style={{ marginTop: 16, borderTop: "1px solid #eee", paddingTop: 12 }}>
                {!userHasRated && (
                    <>
                        <p style={{ marginBottom: 6 }}>Ваша оцінка товару (опційно):</p>
                        <StarRating value={newRating} onChange={setNewRating} size={24} />
                    </>
                )}

                <textarea
                    placeholder={
                        isAuth
                            ? "Залиште відгук"
                            : "Залиште відгук (Щоб лишити відгук — увійдіть або зареєструйтесь)"
                    }
                    className="buyer__contacts__form-input"
                    style={{ marginTop: 8, minHeight: 80 }}
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                />

                <div style={{ marginTop: 8 }}>
                    <button
                        className="neu-btn"
                        onClick={submitTop}
                        disabled={
                            submitting ||
                            !isAuth ||
                            // нічого не ввели: ні тексту, ні нової оцінки
                            (!newText.trim() && (userHasRated || newRating === 0))
                        }
                    >
                        Надіслати
                    </button>
                </div>
            </div>

            <div style={{ marginTop: 10 }} className="muted">
                Середня оцінка: <b>{avg.toFixed(1)}</b> із 5 • оцінок: <b>{count}</b>
            </div>
        </section>
    );
}

function ReviewItem({ node, isAdmin, onReply, onDelete, userId }) {
    const [replyOpen, setReplyOpen] = useState(false);
    const [text, setText] = useState("");

    const isRoot = !node.parentId;
    const mineBadge = userId && node.user?.id === userId;

    return (
        <div style={{ marginBottom: 12 }}>
            <div
                style={{
                    background: "#fafafa",
                    border: "1px solid #eee",
                    borderRadius: 8,
                    padding: 10,
                    marginLeft: isRoot ? 0 : 24,
                }}
            >
                {/* ім’я + зірки зліва */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <strong>{node.user?.name || "Користувач"}</strong>
                    {mineBadge && <span className="muted">(це ви)</span>}
                    {isRoot && node.rating ? <StarRating value={node.rating} size={16} readOnly /> : null}
                </div>

                {node.text && <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{node.text}</div>}

                {/* лише дата */}
                <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                    {new Date(node.createdAt).toLocaleDateString("uk-UA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                    {/* Відповідати та видаляти — тільки адмін */}
                    {isAdmin && (
                        <>
                            <button className="link-btn" onClick={() => setReplyOpen((s) => !s)}>Відповісти</button>
                            <button className="link-btn danger" onClick={() => onDelete(node.id)}>Видалити</button>
                        </>
                    )}
                </div>

                {isAdmin && replyOpen && (
                    <div style={{ marginTop: 8 }}>
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

            {node.children?.length > 0 &&
                node.children.map((ch) => (
                    <ReviewItem
                        key={ch.id}
                        node={ch}
                        isAdmin={isAdmin}
                        onReply={onReply}
                        onDelete={onDelete}
                        userId={userId}
                    />
                ))}
        </div>
    );
}