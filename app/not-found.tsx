export const dynamic = "force-dynamic";

export default function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center p-8">
            <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
            <p className="text-gray-600">The page you are looking for does not exist.</p>
        </div>
    );
}
