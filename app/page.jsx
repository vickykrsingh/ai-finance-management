import HeroSection from "@/components/hero";
import { Button } from "@/components/ui/button";
import { statsData } from "@/data/landing";

export default function Home() {
  return (
    <div className="mt-40">
      <HeroSection/>

      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {
              statsData.map((stats)=>(
                <div key={stats.label} className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{stats.label}</div>
                  <div className="text-gray-600">{stats.value}</div>
                </div>
              ))
            }
          </div>
        </div>
      </section>
      
    </div>
  );
}
