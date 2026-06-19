/**
 * Configure Sales Rep Default View for Leads Collection
 * Run this script to set up role-based presets for Sales Reps
 */

const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'admin@test.com';
const ADMIN_PASSWORD = 'directus123';

async function configureSalesRepPreset() {
	const { Directus } = await import('@directus/sdk');

	const directus = new Directus(DIRECTUS_URL);

	try {
		// Login as admin
		await directus.auth.login({
			email: ADMIN_EMAIL,
			password: ADMIN_PASSWORD,
		});

		console.log('✅ Logged in as admin');

		// Get Sales Rep role ID
		const roles = await directus.roles.readByQuery({
			filter: {
				name: { _eq: 'Sales Rep' },
			},
		});

		let salesRepRoleId;

		if (roles.data.length === 0) {
			// Create Sales Rep role if it doesn't exist
			const newRole = await directus.roles.createOne({
				name: 'Sales Rep',
				icon: 'person',
				description: 'Sales representatives with access to leads and CRM data',
				admin_access: false,
				app_access: true,
			});

			salesRepRoleId = newRole.id;
			console.log('✅ Created Sales Rep role');
		} else {
			salesRepRoleId = roles.data[0].id;
			console.log('✅ Found existing Sales Rep role');
		}

		// Configure default preset for Leads collection
		const preset = {
			role: salesRepRoleId,
			collection: 'leads',
			layout: 'tabular',
			layout_options: {
				widths: {
					name: 200,
					email: 250,
					phone: 150,
					company: 200,
					lead_type: 120,
					processing_status: 150,
					status: 100,
					responsible_user: 150,
					date_created: 150,
				},
			},
			layout_query: {
				tabular: {
					fields: [
						'name',
						'email',
						'phone',
						'company',
						'lead_type',
						'processing_status',
						'status',
						'responsible_user',
						'date_created',
					],
					sort: ['-date_created'],
				},
			},
		};

		// Check if preset already exists
		const existingPresets = await directus.presets.readByQuery({
			filter: {
				role: { _eq: salesRepRoleId },
				collection: { _eq: 'leads' },
			},
		});

		if (existingPresets.data.length > 0) {
			// Update existing preset
			await directus.presets.updateOne(existingPresets.data[0].id, preset);
			console.log('✅ Updated existing Sales Rep preset for Leads');
		} else {
			// Create new preset
			await directus.presets.createOne(preset);
			console.log('✅ Created new Sales Rep preset for Leads');
		}

		console.log('\n🎉 Sales Rep default view configured successfully!');
		console.log('\nDefault columns for Sales Reps:');
		console.log('- Contact Name (name)');
		console.log('- Email (email)');
		console.log('- Phone (phone)');
		console.log('- Company (company)');
		console.log('- Lead Type (lead_type)');
		console.log('- Processing Status (processing_status)');
		console.log('- Status (status)');
		console.log('- Responsible User (responsible_user)');
		console.log('- Date Created (date_created)');
	} catch (error) {
		console.error('❌ Error configuring preset:', error);
	}
}

// Run the configuration
configureSalesRepPreset();
