import { Box } from "@mui/material";
import React, { useState } from "react";

const AQI_LEVELS = [
    { max: 50, color: "#00e400" },     // Good
    { max: 100, color: "#ffff00" },    // Moderate
    { max: 150, color: "#ff7e00" },    // Unhealthy for Sensitive
    { max: 200, color: "#ff0000" },    // Unhealthy
    { max: 300, color: "#8f3f97" },    // Very Unhealthy
    { max: Infinity, color: "#7e0023" } // Hazardous
];

function getAQIColor(aqi) {
    if (aqi === undefined) return "#e5e7eb";
    return AQI_LEVELS.find(level => aqi <= level.max).color;
}

function generateCalendarDays(year, month) {
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];

    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }

    for (let d = 1; d <= totalDays; d++) {
        days.push(d);
    }

    return days;
}

export default function AQICalendar({ aqiData = {} }) {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(
        new Date(today.getFullYear(), today.getMonth(), 1)
    );

    const minDate = new Date(today.getFullYear(), today.getMonth() - 3, 1);
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 3, 1);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const days = generateCalendarDays(year, month);

    const changeMonth = (direction) => {
        const newDate = new Date(year, month + direction, 1);

        if (newDate >= minDate && newDate <= maxDate) {
            setCurrentDate(newDate);
        }
    };

    const monthName = currentDate.toLocaleString("default", { month: "long" });

    return (
        <Box
            sx={{
                background: 'var(--white)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '28px',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                <div style={{ width: 350, fontFamily: "sans-serif" }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 10
                    }}>
                        <button onClick={() => changeMonth(-1)}>◀</button>
                        <h3>{monthName} {year}</h3>
                        <button onClick={() => changeMonth(1)}>▶</button>
                    </div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(7, 1fr)",
                        gap: 4
                    }}>
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                            <div key={d} style={{ fontWeight: "bold", textAlign: "center" }}>
                                {d}
                            </div>
                        ))}

                        {days.map((day, i) => {
                            if (!day) return <div key={i}></div>;

                            const dateKey =
                                `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                            const aqi = aqiData[dateKey];
                            const color = getAQIColor(aqi);

                            return (
                                <div
                                    key={i}
                                    style={{
                                        height: 40,
                                        backgroundColor: color,
                                        borderRadius: 6,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 14,
                                        color: "#000"
                                    }}
                                    title={aqi ? `AQI: ${aqi}` : "No data"}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Box>
        </Box>

    );
}