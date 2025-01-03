import HeroSection from "@/components/hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { featuresData, howItWorksData, statsData, testimonialsData } from "@/data/landing";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="mt-40">
      {/* Hero section */}
      <HeroSection/>
      {/* Stats section */}
      <section className="py-20 bg-emerald-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {
              statsData.map((stats,index)=>(
                <div key={index} className="text-center">
                  <div className="text-lg font-bold text-emerald-600 mb-2">{stats.label}</div>
                  <div className="text-gray-600">{stats.value}</div>
                </div>
              ))
            }
          </div>
        </div>
      </section>
      {/* Features section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2  className="text-3xl font-bold text-center mb-12">Everythings you need to manage your finances</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((features,index)=>(
            <Card key={index} className="p-6">
              <CardContent className="space-y-4 pt-4">
                {features.icon}
                <h3 className="text-xl font-semibold">{features.title}</h3>
                <p className="text-gray-600">{features.description}</p>
              </CardContent>
            </Card>            
            ))}
          </div>
        </div>
      </section>
      {/* How it works section */}
      <section className="py-20 bg-emerald-50">
        <div className="container mx-auto px-4">
          <h2  className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {howItWorksData.map((step,index)=>(
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2  className="text-3xl font-bold text-center mb-12">Everythings you need to manage your finances</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonialsData.map((testimonial,index)=>(
            <Card key={index} className="p-6">
              <CardContent className="pt-4">
                <div className="flex flex-col items-center mb-4">
                  <div className="flex w-full mb-4">
                  <Image src={testimonial.image} alt={testimonial.name} height={40} width={40} className="rounded-full" />
                  <div className="ml-4">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                  </div>
                  <p className="text-gray-600 text-sm">{testimonial.quote}</p>
                </div>
              </CardContent>
            </Card>            
            ))}
          </div>
        </div>
      </section>
      {/* Call to action */}
      <section className="py-20 bg-emerald-600">
        <div className="container mx-auto px-4 text-center">
          <h2  className="text-3xl font-bold text-white mb-4">Ready to Take of Your Finances?</h2>
          <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">Join thousands of users who are already managing their finances smarter with Welth</p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 animate-bounce" >Start Free Trail</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
