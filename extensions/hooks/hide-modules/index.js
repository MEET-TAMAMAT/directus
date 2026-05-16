module.exports = function registerHook({ filter }) {
	filter('settings.read', async (items, meta, context) => {
		// Check if user is authenticated and not an admin
		if (context.accountability && !context.accountability.admin) {
			const userRole = context.accountability.role;
			const salesRepRoleId = '4c38ceb1-1d23-409b-9d51-66edbdd97fba';

			// If user is a Sales Rep, customize their module bar
			if (userRole === salesRepRoleId) {
				const settings = items[0];

				// Define ONLY the modules Sales Reps should see
				settings.module_bar = [
					{"type": "module", "id": "content", "enabled": true},          // Content/Collections
					{"type": "module", "id": "files", "enabled": true},           // File Library
					// Hidden from Sales Reps: Visual Editor, User Directory, Documentation, Settings, Insights
					// Future custom links/modules can be added here as needed
				];

				console.log(`[Hide Modules Hook] Sales Rep ${userRole} - showing only Content and File Library modules`);
			}
		}

		return items;
	});
};