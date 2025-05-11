import { useNavigate } from 'react-router-dom';

const dummyPLE = {
  id: 'ple1',
  name: 'PLE',
  poster: './images/MITB.webp',
  headline: 'MITB 2025',
  description: 'The biggest event of the year, featuring the most electrifying matches and moments in wrestling history.',
  date: '2025-06-08T04:30:00+05:30',
  location: 'Las Vegas, NV',
};

export default function LivePLEPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1e2f] to-[#2a2a40] p-6 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-white mb-10 tracking-wide font-orbitron">
        Live PLEs
      </h1>

      <div
        onClick={() => navigate(`/live-ples/${dummyPLE.id}`)}
        className="cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-2xl max-w-md"
      >
        <img
          src={dummyPLE.poster}
          alt={dummyPLE.name}
          className="rounded-2xl shadow-lg border border-[#ffffff22] transition duration-300"
        />
        <h2 className="text-2xl font-semibold text-white text-center mt-4 font-orbitron bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
          {dummyPLE.headline}
        </h2>
      </div>
    </div>
  );
}

