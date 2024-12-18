export function encodeCursor(data: unknown) {
	return Buffer.from(JSON.stringify(data)).toString('base64');
}

export function decodeCursor(cursor: string): unknown {
	return JSON.parse(Buffer.from(cursor, 'base64').toString('utf-8'));
}
