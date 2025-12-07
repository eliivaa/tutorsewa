export default function TutorProfile({ params }: any) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Tutor Profile #{params.id}</h1>
      <p>More profile data will be shown here...</p>
    </div>
  );
}
