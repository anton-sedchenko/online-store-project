import React from "react";

/**
 * StarRating
 * - value: число 0..5 (може бути з дробом)
 * - onChange?: (n) => void  // якщо передано — рейтинг клікабельний
 * - size?: розмір іконок у px (за замовч. 20)
 */
export default function StarRating({value = 0, onChange, size = 20}) {
    const full = Math.floor(value);
    const half = value - full >= 0.5;

    const handleClick = (n) => {
        if (onChange) onChange(n);
    };

    return (
        <div style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
            {[1, 2, 3, 4, 5].map((n) => {
                const filled = n <= full;
                const showHalf = n === full + 1 && half;

                return (
                    <span
                        key={n}
                        onClick={() => handleClick(n)}
                        style={{
                            cursor: onChange ? "pointer" : "default",
                            fontSize: size,
                            lineHeight: 1,
                            color: filled || showHalf ? "#FFD24D" : "#C9CED6",
                            position: "relative",
                            width: size,
                            display: "inline-block",
                            textAlign: "center",
                        }}
                        aria-label={`${n} з 5`}
                        title={`${n} з 5`}
                    >
                        {filled ? "★" : "☆"}
                        {showHalf && (
                            <span
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    top: 0,
                                    width: size / 2,
                                    overflow: "hidden",
                                    color: "#FFD24D",
                                }}
                            >
                                ★
                            </span>
                        )}
                    </span>
                );
            })}
        </div>
    );
}