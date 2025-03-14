import { NextResponse } from 'next/server';
import { MemeLang } from '@/lib/memelang';
export async function POST(req) {
    try {
        const { code } = await req.json();
        if (!code) {
            return NextResponse.json({ error: 'Bhai, code toh bhejo! 😅' }, { status: 400 });
        }
        const interpreter = new MemeLang();
        const output = interpreter.execute(code);
        return NextResponse.json({ output });
    }
    catch (error) {
        console.error('Runtime error:', error);
        // Make error messages more friendly
        let message = error.message;
        if (message.includes('Undefined variable')) {
            message = `Bhai, ye variable toh define hi nahi kiya: ${message.split(':')[1]} 😕`;
        }
        else if (message.includes('Unknown node type')) {
            message = 'Bhai, ye kya likh diya? Samajh nahi aa raha! 🤔';
        }
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
