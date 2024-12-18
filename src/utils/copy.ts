import { toast } from 'sonner';

export const copy = async (text: string, notifyText?: string) => {
	if (!navigator.clipboard) {
		toast.error('copy to clipboard option not available');
	}

	try {
		await navigator.clipboard.writeText(text);
		toast.success(notifyText ?? 'Successfully copied to clipboard');
	} catch (err) {
		console.error(err);
		toast.error('could not copy to clipboard');
	}
};
