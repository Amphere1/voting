export default function UserIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="8" r="4" strokeWidth="2" />
      <path
        strokeWidth="2"
        d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4"
      />
    </svg>
  );
}
