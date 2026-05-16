module.exports = ({ filter, action }, { services, database, getSchema }) => {
	console.log('[Hide Modules Hook] Hook is loading...');

	filter('settings.read', async (items, meta, context) => {
		console.log('[Hide Modules Hook] Settings read filter triggered');
		console.log('[Hide Modules Hook] User accountability:', context.accountability?.role);

		// Check if user is authenticated and not an admin
		if (context.accountability && !context.accountability.admin) {
			const userRole = context.accountability.role;
			const salesRepRoleId = '4c38ceb1-1d23-409b-9d51-66edbdd97fba';

			console.log(`[Hide Modules Hook] Non-admin user detected. Role: ${userRole}`);

			// If user is a Sales Rep, customize their module bar
			if (userRole === salesRepRoleId) {
				console.log('[Hide Modules Hook] Sales Rep detected - filtering module bar');
				const settings = items[0];

				// Define ONLY the modules Sales Reps should see
				settings.module_bar = [
					{"type": "module", "id": "content", "enabled": true},          // Content/Collections
					{"type": "module", "id": "files", "enabled": true},           // File Library
				];

				console.log('[Hide Modules Hook] Module bar filtered for Sales Rep');
			}
		}

		return items;
	});
};