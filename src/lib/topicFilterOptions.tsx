import type { SelectOption } from '@/components/ui/combo-box';

export const topicFilterOptions: SelectOption[] = [
	{
		value: 'all',
		label: 'All',
		addornment: <div className="rainbow-circle" />,
	},
	{
		value: 'fun',
		label: 'Fun',
		addornment: <div className="h-4 w-4 rounded-full bg-topic-fun" />,
	},
	{
		value: 'improvement',
		label: 'Improvement',
		addornment: <div className="h-4 w-4 rounded-full bg-topic-improvement" />,
	},
	{
		value: 'brown-bag',
		label: 'Brown Bag',
		addornment: <div className="h-4 w-4 rounded-full bg-topic-brown-bag" />,
	},
	{
		value: 'pain-point',
		label: 'Pain Point',
		addornment: <div className="h-4 w-4 rounded-full bg-topic-pain-point" />,
	},
	{
		value: 'new-idea',
		label: 'New Idea',
		addornment: <div className="h-4 w-4 rounded-full bg-topic-new-idea" />,
	},
];
