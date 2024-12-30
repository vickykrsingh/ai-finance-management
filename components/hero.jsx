"use client"
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'

function HeroSection() {
  return (
    <div className='pb-20 px-4'>
        <div>
            <h1>
                Manage Your Finances <br/> with Intelligence
            </h1>
            <p>
                An AI-powered financial management platform that helps you track, analyze, and optimize your spending with real-time insights
            </p>
            <div>
                <Link href={'/dashboard'}>
                    <Button size="lg" className="px-8">
                        Get Started
                    </Button>
                </Link>
                <Link href={'/youtube.com'}>
                    <Button size="lg" className="px-8">
                        Watch Demo
                    </Button>
                </Link>
                <div>
                    <div>
                        <Image src="/banner.jpeg" width={1280} height={720} alt='Dashboard Preview' className='rounded-lg shadow-2xl border mx-auto' priority />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default HeroSection