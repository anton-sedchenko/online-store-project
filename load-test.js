import http from "k6/http";
import {check, sleep} from "k6";

export const options = {
    vus: 50,          // кількість віртуальних користувачів
    duration: "30s",  // тривалість тесту
};

export default function () {
    // Тестуємо один із публічних ендпоінтів
    let res = http.get("http://localhost:5000/api/product?page=1&limit=10");
    check(res, {"status was 200": (r) => r.status === 200});

    // Затримка, щоб не спамити
    sleep(1);
}
