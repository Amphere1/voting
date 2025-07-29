import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function RoleCard() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Choose Your Role</h2>
          <p className="text-lg text-gray-600 mt-4">
            Select your role to begin...
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center max-w-3xl mx-auto">
          {/* Voter Card */}
          <Card className="border rounded-xl hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col gap-4 p-6 text-center">
              <div className="mx-auto bg-blue-100 rounded-full p-3 w-16 h-16 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Voter</h3>
              <p className="text-gray-600">
                Cast your vote securely and make your voice heard in democratic
                elections.
              </p>
            </CardContent>
          </Card>

          {/* Candidate Card */}
          <Card className="border rounded-xl hover:shadow-lg transition-shadow">
            <Link href="/candidate/registration">
              <CardContent className="flex flex-col gap-4 p-6 text-center">
                <div className="mx-auto bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Candidate</h3>
                <p className="text-gray-600">
                  Run for office and present your vision to the voters in your
                  community.
                </p>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </section>
  );
}
