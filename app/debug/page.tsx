
export const runtime = 'edge';

export default function DebugPage() {
    const supabaseUrlByProcess = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKeyByProcess = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    return (
        <div style={{ padding: '40px', background: '#000', color: '#fff', fontFamily: 'monospace' }}>
            <h1>Debug Info</h1>
            <p>Runtime: Edge</p>
            <hr style={{ borderColor: '#333' }} />
            <h2>Environment Variables (process.env)</h2>
            <p>
                NEXT_PUBLIC_SUPABASE_URL: {supabaseUrlByProcess ? '✅ Defined' : '❌ UNDEFINED'} <br />
                <span style={{ color: '#888' }}>{supabaseUrlByProcess ? supabaseUrlByProcess.slice(0, 10) + '...' : ''}</span>
            </p>
            <p>
                NEXT_PUBLIC_SUPABASE_ANON_KEY: {supabaseKeyByProcess ? '✅ Defined' : '❌ UNDEFINED'} <br />
                <span style={{ color: '#888' }}>{supabaseKeyByProcess ? supabaseKeyByProcess.slice(0, 10) + '...' : ''}</span>
            </p>
        </div>
    );
}
