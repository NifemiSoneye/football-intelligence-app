"use client";

type Props = {
  step: number;
};

export default function StepIndicator({ step }: Props) {
  return (
    <div className="flex justify-between items-center mt-4 mb-14 ">
      <div className="text-[12px] flex items-center gap-2 font-semibold">
        <div
          className={`w-7 h-7 rounded-full p-2 flex items-center justify-center
            ${
              step === 1
                ? "bg-[#e8ff47] text-black"
                : " text-[black] border-[#666] bg-[#666]"
            }
          `}
        >
          {step === 1 ? 1 : "✓"}
        </div>

        <p className={step === 1 ? "text-[#e8ff47]" : "text-[#666]"}>LEAGUES</p>
      </div>
      <div className=" text-[12px] flex items-center gap-2 font-semibold">
        <div
          className={`w-7 h-7 rounded-full p-2 border border-[#666] flex items-center justify-center
            ${
              step === 2
                ? "bg-[#e8ff47] text-black"
                : "bg-transparent text-[#666] border-[#666]"
            }
          `}
        >
          <p>2</p>
        </div>
        <p className={step === 2 ? "text-[#e8ff47]" : "text-[#666]"}>TEAMS</p>
      </div>
    </div>
  );
}
