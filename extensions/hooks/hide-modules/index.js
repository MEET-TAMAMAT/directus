export default ({ filter }) => {
	console.log('[Hide Modules Hook] Hook is loading...');

	filter('settings.read', (items, meta, context) => {
		console.log('[Hide Modules Hook] Settings read filter triggered');

		if (context.accountability && !context.accountability.admin) {
			const userRole = context.accountability.role;
			const salesRepRoleId = '4c38ceb1-1d23-409b-9d51-66edbdd97fba';

			console.log(`[Hide Modules Hook] Non-admin user detected. Role: ${userRole}`);

			if (userRole === salesRepRoleId) {
				console.log('[Hide Modules Hook] Sales Rep detected - filtering module bar');

				if (items && items[0] && items[0].module_bar) {
					items[0].module_bar = [
						{"type": "module", "id": "content", "enabled": true},
						{"type": "module", "id": "files", "enabled": true}
					];
					console.log('[Hide Modules Hook] Module bar filtered for Sales Rep');
				}
			}
		}

		return items;
	});
};