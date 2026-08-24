export function LandingWaves() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: 0.85 }}
      >
        <defs>
          <linearGradient id="cyan-wave" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="purple-wave" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#ec4899" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g fill="none" stroke="url(#cyan-wave)" strokeWidth="1.8">
          <path d="M-100,200 C300,100 400,450 100,600 C-200,750 -50,900 200,850" />
          <path d="M-80,220 C320,120 410,460 120,620 C-180,770 -30,910 220,870" />
          <path d="M-60,240 C340,140 420,470 140,640 C-160,790 -10,920 240,890" />
          <path d="M-40,260 C360,160 430,480 160,660 C-140,810 10,930 260,910" />
        </g>

        <g fill="none" stroke="url(#purple-wave)" strokeWidth="2">
          <path d="M1600,100 C1100,50 900,350 1200,500 C1450,620 1300,850 1000,900" />
          <path d="M1580,120 C1090,70 890,360 1190,520 C1430,640 1290,860 990,920" />
          <path d="M1560,140 C1080,90 880,370 1180,540 C1410,660 1280,870 980,940" />
          <path d="M1540,160 C1070,110 870,380 1170,560 C1390,680 1270,880 970,960" />
          <path d="M1520,180 C1060,130 860,390 1160,580 C1370,700 1260,890 960,980" />
        </g>
      </svg>
    </div>
  );
}
