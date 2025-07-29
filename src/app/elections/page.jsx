"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SearchIcon from "@/components/icons/SearchIcon";



export default function ElectionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch from API
  useEffect(() => {
    const fetchElections = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/elections");
        if (!response.ok) throw new Error("API error");
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setElections(data.map(election => ({
            ...election,
            status: election.status || getElectionStatus(election.startDate, election.endDate),
            id: election._id || election.id,
          })));
        } else {
          setElections([]);
          setError("No elections found in the database.");
        }
      } catch (err) {
        setElections([]);
        setError("Failed to fetch elections. Please try again later.");
        console.error("Error fetching elections:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchElections();
    // eslint-disable-next-line
  }, []);

  // Helper to determine status if not present in DB
  function getElectionStatus(startDate, endDate) {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (now < start) return "upcoming";
    if (now > end) return "completed";
    return "ongoing";
  }

  // Memoized filtered elections for better performance
  const filteredElections = useMemo(() => {
    if (!searchTerm.trim()) return elections;

    const term = searchTerm.toLowerCase();
    return elections.filter(
      (election) =>
        election.title.toLowerCase().includes(term) ||
        election.description.toLowerCase().includes(term)
    );
  }, [elections, searchTerm]);

  // Format date for better display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get election status badge
  const getStatusBadge = (status) => {
    const statusColors = {
      ongoing: "bg-green-100 text-green-800",
      upcoming: "bg-yellow-100 text-yellow-800",
      completed: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusColors[status] || statusColors.ongoing
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="layout-content-container flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold tracking-tighter">
            Ongoing Elections
          </h1>
          <p className="text-lg text-gray-600">
            Explore current elections and make your voice heard.
            {elections.length > 0 &&
              ` Found ${elections.length} election${
                elections.length !== 1 ? "s" : ""
              }.`}
          </p>
        </div>

        {/* Search Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-2/3 lg:w-1/2">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="search"
              placeholder="Search elections by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-full border-0 bg-gray-50 py-2.5 pl-10 pr-3 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              aria-label="Search elections"
            />
          </div>
          {searchTerm && (
            <Button
              variant="outline"
              onClick={() => setSearchTerm("")}
              className="md:w-auto w-full"
            >
              Clear Search
            </Button>
          )}
        </div>

        {/* Elections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredElections.map((election) => (
            <Card
              key={election.id}
              className="flex flex-col rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <CardContent className="p-6 flex flex-col gap-4 h-full">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold leading-tight">
                      {election.title}
                    </h3>
                    {election.status && getStatusBadge(election.status)}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Start: {formatDate(election.startDate)}</span>
                    <span>•</span>
                    <span>End: {formatDate(election.endDate)}</span>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {election.description}
                  </p>
                </div>

                <div className="mt-auto flex gap-3">
                  <Button
                    variant="secondary"
                    asChild
                    className="flex-1 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                  >
                    <Link href={`/election-details/${election.id}`}>View Details</Link>
                  </Button>
                  <Button
                    asChild
                    className="flex-1 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
                    disabled={election.status === "completed"}
                  >
                    <Link href={`/election-details/${election.id}/vote`}>
                      {election.status === "completed"
                        ? "Voting Closed"
                        : "Participate"}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results Message */}
        {filteredElections.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 mb-4 text-gray-300">
              <SearchIcon className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No elections found
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? `No elections match "${searchTerm}". Try adjusting your search.`
                : "No elections are currently available."}
            </p>
            {searchTerm && (
              <Button
                variant="outline"
                onClick={() => setSearchTerm("")}
                className="mt-4"
              >
                Clear Search
              </Button>
            )}
          </div>
        )}

        {/* Summary Stats */}
        {elections.length > 0 && (
          <div className="border-t pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {elections.filter((e) => e.status === "ongoing").length}
                </p>
                <p className="text-sm text-gray-600">Active Elections</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {elections.filter((e) => e.status === "upcoming").length}
                </p>
                <p className="text-sm text-gray-600">Upcoming Elections</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-600">
                  {elections.filter((e) => e.status === "completed").length}
                </p>
                <p className="text-sm text-gray-600">Completed Elections</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
