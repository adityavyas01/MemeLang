import { NextResponse } from 'next/server';
export declare function POST(req: Request): Promise<NextResponse<{
    output: any;
}> | NextResponse<{
    error: any;
}>>;
