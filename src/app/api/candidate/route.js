import { dbConnect } from '@/lib/dbconnect';
import Candidate from '@/models/candidate';
import Election from '@/models/election';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
      const experience = formData.get('experience') || '';
      const education = formData.get('education') || '';
      const achievements = formData.get('achievements') || '';
      const website = formData.get('website') || '';
      const twitter = formData.get('twitter') || '';
      const facebook = formData.get('facebook') || '';
      const email = formData.get('email') || '';
      const phone = formData.get('phone') || '';
      const dateOfBirth = formData.get('dateOfBirth') || '';
      const slogan = formData.get('slogan') || '';
      // electionId is optional, add if you want to support it
      const electionId = formData.get('electionId') || undefined;
      let imgUrl = undefined;
      const imgFile = formData.get('img');
      if (imgFile && typeof imgFile.arrayBuffer === 'function') {
        const buffer = Buffer.from(await imgFile.arrayBuffer());
        // Convert buffer to base64 string for Cloudinary upload
        const base64String = buffer.toString('base64');
        const dataUri = `data:${imgFile.type};base64,${base64String}`;
        try {
          const uploadRes = await cloudinary.uploader.upload(dataUri, {
            folder: 'candidates',
            resource_type: 'image',
          });
          imgUrl = uploadRes.secure_url;
        } catch (err) {
          return new Response(JSON.stringify({ success: false, error: 'Image upload failed', details: err.message }), { status: 500 });
        }
      }
      const candidate = await Candidate.create({
        name,
        age,
        organization,
        bio,
        experience,
        education,
        achievements,
        website,
        twitter,
        facebook,
        img: imgUrl,
        email,
        phone,
        dateOfBirth,
        slogan,
        electionId,
      });

      // Add candidate to election's candidates array if electionId is provided
      if (electionId) {
        await Election.findByIdAndUpdate(electionId, { 
          $push: { candidates: candidate._id } 
        });
      }

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
    // Just return the plain img URL string
    const candidatesWithImg = candidates.map((c) => ({
      _id: c._id,
      name: c.name,
      organization: c.organization,
      age: c.age,
      bio: c.bio,
      experience: c.experience,
      education: c.education,
      achievements: c.achievements,
      website: c.website,
      twitter: c.twitter,
      facebook: c.facebook,
      img: c.img,
      email: c.email,
      phone: c.phone,
      dateOfBirth: c.dateOfBirth,
      slogan: c.slogan,
      electionId: c.electionId,
    }));
    return new Response(JSON.stringify({ success: true, candidates: candidatesWithImg }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const candidateId = searchParams.get('id');
    
    if (!candidateId) {
      return new Response(JSON.stringify({ error: 'Candidate ID is required' }), { status: 400 });
    }

    const deletedCandidate = await Candidate.findByIdAndDelete(candidateId);
    
    if (!deletedCandidate) {
      return new Response(JSON.stringify({ error: 'Candidate not found' }), { status: 404 });
    }

    return new Response(
      JSON.stringify({ message: 'Candidate deleted successfully', candidate: deletedCandidate }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}