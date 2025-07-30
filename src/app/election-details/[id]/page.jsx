"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CheckIcon from "@/components/icons/CheckIcon";
import { electionDetailsData } from "@/config/electionDetailsData";

export default function ElectionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Protected route: check if user is logged in
  useEffect(() => {
    fetch("/api/auth/voter/me").then(async (res) => {
      const data = await res.json();
      if (!data.loggedIn) {
        router.replace("/login");
      } else {
        setAuthChecked(true);
      }
    });
  }, [router]);

  // Simulate API call - replace this with actual API call in the future
  useEffect(() => {
    if (!authChecked) return;
    const fetchElectionDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        // TODO: Replace with actual API call
        // const response = await fetch(`/api/elections/${params.id}`);
        // const data = await response.json();
        // setElection(data);

        const electionData = electionDetailsData[params.id];
        if (!electionData) {
          throw new Error("Election not found");
        }
        setElection(electionData);
      } catch (err) {
        setError(err.message || "Failed to fetch election details. Please try again later.");
        console.error("Error fetching election details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchElectionDetails();
    }
  }, [params.id, authChecked]);

  // Format date for better display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Check if user is eligible to vote (mock function)
  const isEligibleToVote = () => {
    // TODO: Replace with actual eligibility check from API
    return true;
  };

  if (loading || !authChecked) {
    return (
      <main className="container mx-auto flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </main>
    );
  }

  if (error || !election) {
    return (
      <main className="container mx-auto flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg mb-4">{error || "Election not found"}</p>
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
    <main className="container mx-auto flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Election Header */}
        <Card className="mb-8 bg-white shadow-md">
          <CardContent className="p-6">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
              {election.title}
            </h1>
            <p className="mt-2 text-lg text-gray-600">{election.description}</p>
            
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-xl font-bold text-gray-900">Election Details</h3>
              <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-600">Start Date</dt>
                  <dd className="mt-1 text-sm font-semibold text-gray-900">
                    {formatDate(election.startDate)}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-600">End Date</dt>
                  <dd className="mt-1 text-sm font-semibold text-gray-900">
                    {formatDate(election.endDate)}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-600">Eligibility</dt>
                  <dd className="mt-1 text-sm font-semibold text-gray-900">
                    {election.eligibility}
                  </dd>
                </div>
              </dl>
            </div>
          </CardContent>
        </Card>

        {/* Candidates Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Candidates</h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {election.candidates.map((candidate) => (
              <Card
                key={candidate.id}
                className="overflow-hidden bg-white shadow-lg transition-transform duration-300 hover:scale-105"
              >
                <div
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url("${candidate.image}")` }}
                />
                <CardContent className="p-6">
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{candidate.name}</h4>
                      <p className="text-sm text-gray-600">{candidate.party}</p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 rounded-full py-2 text-sm font-semibold"
                        asChild
                      >
                        <Link href={`/candidate/${candidate.id}`}>View Profile</Link>
                      </Button>
                      {election.status === "ongoing" && isEligibleToVote() && (
                        <Button
                          className="flex-1 rounded-full py-2 text-sm font-bold bg-green-600 hover:bg-green-700 transition-colors"
                          onClick={() => {
                            // TODO: Implement vote functionality
                            alert(`Voting for ${candidate.name}`);
                          }}
                        >
                          Vote
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Status Information */}
        {election.status === "completed" && (
          <Card className="bg-gray-50 shadow-md mb-8">
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-gray-100 p-3 text-gray-600">
                  <CheckIcon className="h-8 w-8" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">This election has ended</p>
                  <p className="text-sm text-gray-600">Voting closed on {formatDate(election.endDate)}</p>
                </div>
                <Button
                  variant="outline"
                  className="mt-2 rounded-full px-8 py-3 text-base font-bold tracking-wider"
                  onClick={() => router.push(`/election-details/${election.id}/results`)}
                >
                  View Results
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {election.status === "upcoming" && (
          <Card className="bg-yellow-50 shadow-md mb-8">
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-yellow-100 p-3 text-yellow-600">
                  <CheckIcon className="h-8 w-8" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">This election has not started yet</p>
                  <p className="text-sm text-gray-600">
                    Voting begins on {formatDate(election.startDate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {election.status === "ongoing" && !isEligibleToVote() && (
          <Card className="bg-red-50 shadow-md mb-8">
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-red-100 p-3 text-red-600">
                  <CheckIcon className="h-8 w-8" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">You are not eligible to vote</p>
                  <p className="text-sm text-gray-600">Please check the eligibility requirements above</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
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
