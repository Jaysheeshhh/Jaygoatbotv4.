module.exports = {
	config: {
		name: "ugly",
		version: "1.0",
		author: "Samir",
		role: 0,
		category: "fun",
		guide: {
			vi: "Just For Fun",
			en: "Calculate Your Uglyness"
		} 
	},

	onStart: async function ({ api, event }) {
			const data = [
				"You Are 1% So Ugly🥺", "You Are 2% So Ugly🥺", "You Are 3% So Ugly🥺", "You Are 4% So Ugly🥺",
				"You Are 5% So Ugly🥺", "You Are 6% So Ugly🥺", "You Are 7% So Ugly🥺", "You Are 8% So Ugly🥺",
				"You Are 9% So Ugly🥺", "You Are 10% So Ugly🥺", "You Are 11% So Ugly🥺", "You Are 12% So Ugly🥺",
				"You Are 13% So Ugly🥺", "You Are 14% So Ugly🥺", "You Are 15% So Ugly🥺", "You Are 16% So Ugly🥺",
				"You Are 17% So Ugly🥺", "You Are 18% So Ugly🥺", "You Are 19% So Ugly🥺", "You Are 20% So Ugly🥺",
				"You Are 21% So Ugly🥺", "You Are 22% So Ugly🥺", "You Are 23% So Ugly🥺", "You Are 24% So Ugly🥺",
				"You Are 25% So Ugly🥺", "You Are 26% So Ugly🥺", "You Are 27% So Ugly🥺", "You Are 28% So Ugly🥺",
				"You Are 29% So Ugly🥺", "You Are 30% So Ugly🥺", "You Are 31% So Ugly🥺", "You Are 32% So Ugly🥺",
				"You Are 33% So Ugly🥺", "You Are 34% So Ugly🥺", "You Are 35% So Ugly🥺", "You Are 36% So Ugly🥺",
				"You Are 37% So Ugly🥺", "You Are 38% So Ugly🥺", "You Are 39% So Ugly🥺", "You Are 40% So Ugly🥺",
				"You Are 41% So Ugly🥺", "You Are 42% So Ugly🥺", "You Are 43% So Ugly🥺", "You Are 44% So Ugly🥺",
				"You Are 45% So Ugly🥺", "You Are 46% So Ugly🥺", "You Are 47% So Ugly🥺", "You Are 48% So Ugly🥺",
				"You Are 49% So Ugly🥺", "You Are 50% So Ugly🥺", "You Are 51% So Ugly🥺", "You Are 52% So Ugly🥺",
				"You Are 53% So Ugly🥺", "You Are 54% So Ugly🥺", "You Are 55% So Ugly🥺", "You Are 56% So Ugly🥺",
				"You Are 57% So Ugly🥺", "You Are 58% So Ugly🥺", "You Are 59% So Ugly🥺", "You Are 60% So Ugly🥺",
				"You Are 61% So Ugly🥺", "You Are 62% So Ugly🥺", "You Are 63% So Ugly🥺", "You Are 64% So Ugly🥺",
				"You Are 65% So Ugly🥺", "You Are 66% So Ugly🥺", "You Are 67% So Ugly🥺", "You Are 68% So Ugly🥺",
				"You Are 69% So Ugly🥺", "You Are 70% So Ugly🥺", "You Are 71% So Ugly🥺", "You Are 72% So Ugly🥺",
				"You Are 73% So Ugly🥺", "You Are 74% So Ugly🥺", "You Are 75% So Ugly🥺", "You Are 76% So Ugly🥺",
				"You Are 77% So Ugly🥺", "You Are 78% So Ugly🥺", "You Are 79% So Ugly🥺", "You Are 80% So Ugly🥺",
				"You Are 81% So Ugly🥺", "You Are 82% So Ugly🥺", "You Are 83% So Ugly🥺", "You Are 84% So Ugly🥺",
				"You Are 85% So Ugly🥺", "You Are 86% So Ugly🥺", "You Are 87% So Ugly🥺", "You Are 88% So Ugly🥺",
				"You Are 89% So Ugly🥺", "You Are 90% So Ugly🥺", "You Are 91% So Ugly🥺", "You Are 92% So Ugly🥺",
				"You Are 93% So Ugly🥺", "You Are 94% So Ugly🥺", "You Are 95% So Ugly🥺", "You Are 96% So Ugly🥺",
				"You Are 97% So Ugly🥺", "You Are 98% So Ugly🥺", "You Are 99% So Ugly🥺", "You Are 100% So Ugly🥺"
		];
		return api.sendMessage(`${data[Math.floor(Math.random() * data.length)]}`, event.threadID, event.messageID);
	}
};
