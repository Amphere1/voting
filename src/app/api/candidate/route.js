import { dbConnect } from '@/lib/dbconnect';
import Candidate from '@/models/candidate';

export async function POST(request) {
  try {
    await dbConnect();
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const name = formData.get('name');
      const organization = formData.get('organization');
      const age = formData.get('age');
      const bio = formData.get('bio');
      const imgFile = formData.get('img');
      let img = undefined;
      if (imgFile && typeof imgFile.arrayBuffer === 'function') {
        const buffer = Buffer.from(await imgFile.arrayBuffer());
        img = {
          data: buffer,
          contentType: imgFile.type,
        };
      }
      const candidate = await Candidate.create({
        name,
        age,
        organization,
        bio,
        img,
      });
      return new Response(
        JSON.stringify({ message: 'Candidate registered successfully', candidate }),
        { status: 201 }
      );
    } else {
      const { name, organization, age, bio } = await request.json();
      const candidate = await Candidate.create({
        name,
        age,
        organization,
        bio,
      });
      return new Response(
        JSON.stringify({ message: 'Candidate registered successfully', candidate }),
        { status: 201 }
      );
    }
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

export async function GET(request) {
  try {
    await dbConnect();
    const candidates = await Candidate.find();
    const candidatesWithImg = candidates.map((c) => {
      let img = null;
      if (c.img && c.img.data) {
        img = {
          data: c.img.data.toString('base64'),
          contentType: c.img.contentType,
        };
      }
      return {
        _id: c._id,
        name: c.name,
        organization: c.organization,
        age: c.age,
        bio: c.bio,
        img,
      };
    });
    return new Response(JSON.stringify({ success: true, candidates: candidatesWithImg }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}