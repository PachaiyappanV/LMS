"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";

const CompletionPage = () => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
  }, []);

  return (
    <div className="completion">
      {showConfetti && <Confetti />}
      <div className="completion__content">
        <div className="completion__icon">
          <Check className="w-16 h-16" />
        </div>
        <h1 className="completion__title">COMPLETED</h1>
        <p className="completion__message">
          🎉 You have made a course purchase successfully! 🎉
        </p>
      </div>
      <div className="completion__support">
        <p>
          Need help? Contact our{" "}
          <Button variant="link" asChild className="p-0 m-0 text-primary-700">
            <a href="mailto:support@example.com">customer support</a>
          </Button>
          .
        </p>
      </div>
      <div className="completion__action">
        <Link href="user/courses" scroll={false}>
          Go to Courses
        </Link>
      </div>
    </div>
  );
};

export default CompletionPage;
