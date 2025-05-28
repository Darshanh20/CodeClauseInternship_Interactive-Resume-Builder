import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from "jspdf";

export default function Template1({ resume, skills, education, experience, certifications, links }) {
  const resumeRef = useRef();
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/intropage?resumeId=${resume.id}`);
  };
  const handleDownload = async () => {
    const element = resumeRef.current;

    const originalWidth = element.offsetWidth;
    element.style.width = '794px'; 

    try {
      const dataUrl = await htmlToImage.toPng(element, {
        quality: 1,
        pixelRatio: 2 
      });

      element.style.width = `${originalWidth}px`;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(dataUrl, 'PNG', 0, 0, pageWidth, pageHeight);
      pdf.save('resume.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      element.style.width = `${originalWidth}px`;
    }
  };
  return (
    <div>
      <div ref={resumeRef} className="resume-container">
        <div className="max-w-3xl mx-auto my-5 bg-white p-10 shadow-lg rounded-lg text-gray-800 font-sans">
          <div ref={resumeRef}>
            {/* Header */}
            <div className="pb-4 mb-6">
              <h1 className="text-4xl font-bold">{resume.full_name}</h1>
              <p className="text-sm text-gray-600 mt-1">
                {resume.phone} &nbsp;|&nbsp; {resume.email}
              </p>
            </div>

            {/* Summary */}
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-1 mb-2">Professional Summary</h2>
              <p className="text-sm leading-relaxed">{resume.summary}</p>
            </section>

            {/* Skills */}
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-1 mb-2">Skills</h2>
              <ul className="flex flex-wrap gap-2 text-sm">
                {skills.map((s, i) => (
                  <li key={i} className="bg-gray-100 px-3 py-1 rounded-full">{s.name}</li>
                ))}
              </ul>
            </section>

            {/* Education */}
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-1 mb-2">Education</h2>
              {education.map((edu, i) => (
                <div key={i} className="mb-3">
                  <p className="font-medium">{edu.institution}</p>
                  <p className="text-sm text-gray-600">{edu.from_date} – {edu.to_date}</p>
                </div>
              ))}
            </section>

            {/* Experience */}
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-1 mb-2">Experience</h2>
              {experience.map((exp, i) => (
                <div key={i} className="mb-3">
                  <p className="font-medium">{exp.role} at {exp.company}</p>
                  <p className="text-sm text-gray-600">{exp.from_date} – {exp.to_date}</p>
                </div>
              ))}
            </section>

            {/* Certifications */}
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-1 mb-2">Certifications</h2>
              <ul className="list-disc list-inside text-sm">
                {certifications.map((c, i) => (
                  <li key={i}>{c.title}</li>
                ))}
              </ul>
            </section>

            {/* Links */}
            <section>
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-1 mb-2">Links</h2>
              <ul className="list-disc list-inside text-sm">
                {links.map((l, i) => (
                  <li key={i}>
                    <span className="font-medium">{l.label}:</span>{" "}
                    <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                      {l.url}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
      <div className='flex justify-center gap-3'>
        <button
          onClick={handleEdit}
          className=" bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl cursor-pointer mb-4"
        >
          Edit Resume
        </button>
        <button
          onClick={handleDownload}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl cursor-pointer mb-4"
        >
          Download as PDF
        </button>
      </div>
    </div>
  );
}
