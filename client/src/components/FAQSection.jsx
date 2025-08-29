import React, { useState } from "react";

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    if (index === activeIndex) {
      setActiveIndex(null); // Close if the same question is clicked again
    } else {
      setActiveIndex(index); // Open the clicked question
    }
  };

  const questions = [
    {
      question: "How do I create a new room?",
      answer:
        "Just enter a unique Room ID (minimum 3 characters) on the homepage and click 'Join Room'.",
    },
    {
      question: "Can I use this whiteboard on mobile?",
      answer:
        "Yes! Our whiteboard supports both mouse and touch inputs for real-time drawing.",
    },
    {
      question: "Are my notes saved?",
      answer:
        "Yes, your sticky notes and drawings can be stored in the database for future access.",
    },
    {
      question: "Is it free to use?",
      answer:
        "Yes, currently it's completely free for students, teachers, and professionals.",
    },
  ];

  return (
    <section className="bg-[#e9ecef] py-16 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">
        Your questions, answered
      </h2>

      <div className="max-w-3xl mx-auto">
        {questions.map((item, index) => (
          <div key={index} className="mb-4">
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full text-left text-lg font-medium text-gray-800 py-4 px-6 bg-gray-100 border border-gray-300 rounded-md focus:outline-none hover:bg-gray-200"
            >
              {item.question}
            </button>

            {activeIndex === index && (
              <div className="mt-2 text-gray-600 px-6 py-4 bg-gray-50 border border-gray-200 rounded-md">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
