import { hash } from 'bcryptjs';
import { SuperAdmin } from './entity';

export async function createOwner() {
  try {
    const username = process.env.ADMIN_USER;
    const password = process.env.ADMIN_PASS;
    const email = process.env.ADMIN_EMAIL;

    if (!username || !password || !email) {
      console.log('Missing environment variables for SuperAdmin');
      return;
    }

    const existOwner = await SuperAdmin.findOne({ where: { email } });
    if (existOwner) {
      console.log('SuperAdmin already exists');
      return;
    }

    const hashed = await hash(password, 10);

    const payload = {
      username,
      email,
      password: hashed,
      role:'admin'
    };

    await SuperAdmin.create(payload);
    console.log('✅ SuperAdmin created successfully');
  } catch (error) {
    console.error('Error creating SuperAdmin:', error);
  }
}
