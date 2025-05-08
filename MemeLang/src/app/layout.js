"use strict";
exports.__esModule = true;
exports.metadata = void 0;
require("./globals.css");
var google_1 = require("next/font/google");
var next_1 = require("@vercel/analytics/next");
var inter = (0, google_1.Inter)({ subsets: ['latin'] });
exports.metadata = {
    title: 'MemeLang - Toy Programming Language',
    description: 'Suitable for beginners and enthusiasts'
};
function RootLayout(_a) {
    var children = _a.children;
    return (<html lang="en">
      <body className={inter.className}>
        {children}
        <next_1.Analytics />
      </body>
    </html>);
}
exports["default"] = RootLayout;
