"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { candidatesData } from "@/config/candidatesData";

export default function CandidatePage() {
  const params = useParams();
  const router = useRouter();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate API call - replace this with actual API call in the future
  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        // TODO: Replace with actual API call
        // const response = await fetch(`/api/candidates/${params.id}`);
        // const data = await response.json();
        // setCandidate(data);

        const candidateData = candidatesData[params.id];
        if (!candidateData) {
          throw new Error("Candidate not found");
        }
        setCandidate(candidateData);
      } catch (err) {
        setError(err.message || "Failed to fetch candidate details. Please try again later.");
        console.error("Error fetching candidate details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCandidateDetails();
    }
  }, [params.id]);

  if (loading) {
    return (
      <main className="flex flex-1 justify-center bg-gray-50 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </main>
    );
  }

  if (error || !candidate) {
    return (
      <main className="flex flex-1 justify-center bg-gray-50 py-12">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg mb-4">{error || "Candidate not found"}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.back()}>Go Back</Button>
            <Button variant="outline" onClick={() => router.push("/elections")}>
              View All Elections
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 justify-center bg-gray-50 py-12">
      <div className="w-full max-w-5xl space-y-12 px-4">
        {/* Candidate Profile Header */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-8">
            <div className="flex items-start gap-8 flex-col md:flex-row">
              <div 
                className="h-40 w-40 flex-shrink-0 rounded-full bg-cover bg-center bg-no-repeat shadow-md mx-auto md:mx-0" 
                style={{ backgroundImage: `url("${candidate.image}")` }}
              />
              <div className="flex-grow pt-4 text-center md:text-left">
                <h1 className="text-4xl font-bold text-gray-900">{candidate.name}</h1>
                <p className="mt-1 text-lg text-gray-600">{candidate.party}</p>
                <p className="mt-2 text-lg italic text-blue-700">"{candidate.slogan}"</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Left Column - Manifesto */}
          <div className="space-y-8 lg:col-span-2">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Manifesto</h2>
                <p className="text-base leading-relaxed text-gray-700">
                  {candidate.manifesto}
                </p>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Experience</h2>
                <p className="text-base leading-relaxed text-gray-700">
                  {candidate.experience}
                </p>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Education</h2>
                <p className="text-base leading-relaxed text-gray-700">
                  {candidate.education}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Achievements & Actions */}
          <div className="space-y-8">
            {/* Key Achievements */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Key Achievements</h3>
                <ul className="space-y-3">
                  {candidate.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700 leading-relaxed">
                        {achievement}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="bg-blue-50 shadow-sm">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Support {candidate.name}</h3>
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      // TODO: Implement vote functionality
                      alert(`Voting for ${candidate.name}`);
                    }}
                  >
                    Vote for {candidate.name}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      // TODO: Implement contact functionality
                      alert(`Contact ${candidate.name}`);
                    }}
                  >
                    Contact Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Social Links Placeholder */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Follow Campaign</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full text-left justify-start">
                    📧 Email Updates
                  </Button>
                  <Button variant="outline" className="w-full text-left justify-start">
                    🐦 Twitter
                  </Button>
                  <Button variant="outline" className="w-full text-left justify-start">
                    📘 Facebook
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => router.back()}>
            ← Go Back
          </Button>
          <Button variant="outline" onClick={() => router.push("/elections")}>
            View All Elections
          </Button>
        </div>
      </div>
    </main>
  );
}
