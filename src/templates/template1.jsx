import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

export default function Template1({ resume, skills, education, experience, certifications, links }) {
    const resumeRef = useRef();
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/intropage?resumeId=${resume.id}`);
    };
    const handleDownload = async () => {
        if (!resumeRef.current) return;

        try {
            // Store original styles to restore later
            const originalStyles = {
                width: resumeRef.current.style.width,
                height: resumeRef.current.style.height,
                transform: resumeRef.current.style.transform,
            };

            // Force A4 size (in pixels at 96dpi)
            const a4Width = 794; // 210mm in pixels (210 * 96 / 25.4)
            const a4Height = 1123; // 297mm in pixels (297 * 96 / 25.4)

            // Temporarily set pixel dimensions
            resumeRef.current.style.width = `${a4Width}px`;
            resumeRef.current.style.height = `${a4Height}px`;

            // Generate the image with higher quality
            const dataUrl = await htmlToImage.toPng(resumeRef.current, {
                quality: 1,
                pixelRatio: 3, // Higher resolution
                backgroundColor: '#ffffff',
            });

            // Create download link
            const link = document.createElement('a');
            link.download = `${resume.full_name}-resume.png`;
            link.href = dataUrl;
            link.click();

            // Restore original styles
            resumeRef.current.style.width = originalStyles.width;
            resumeRef.current.style.height = originalStyles.height;
            resumeRef.current.style.transform = originalStyles.transform;
        } catch (error) {
            console.error('Error generating image', error);
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div ref={resumeRef} className="resume-container" style={{
                width: '210mm', // A4 width
                height: '297mm', // A4 height
                margin: '0 auto', // Center the resume
                overflow: 'hidden', // Prevent content from overflowing
            }}>
                <div className="max-w-3xl mx-auto my-8 bg-white p-10 shadow-lg rounded-lg text-gray-800 font-sans flex">
                    <div className="flex flex-col gap-10 bg-amber-300 p-3 rounded-2xl">
                        {/* Header */}
                        <div className="flex flex-col gap-10">
                            <h1 className="text-3xl font-bold max-w-3xs">{resume.full_name}</h1>
                            <div>
                                <h1 className="font-bold text-xl border-b">Contact</h1>
                                <p className="text-sm text-gray-600 mt-1">{resume.phone}</p>
                                <p className="text-sm text-gray-600 mt-1">{resume.email}</p>
                            </div>
                        </div>

                        {/* Education */}
                        <section className="mb-6">
                            <h2 className="text-xl text-gray-700 pb-1 mb-2 font-bold border-b">Education</h2>
                            {education.map((edu, i) => (
                                <div key={i} className="mb-3">
                                    <p className="font-mono">{edu.institution}</p>
                                    <p className="text-sm text-gray-600 font-sans">
                                        {new Date(edu.from_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} –{' '}
                                        {new Date(edu.to_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            ))}
                        </section>

                        {/* Links */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-700 pb-1 mb-2 border-b">Links</h2>
                            <ul className="list-disc list-inside text-sm">
                                {links.map((l, i) => (
                                    <li key={i} className="flex flex-col">
                                        <span className="font-medium">{l.label}:</span>{' '}
                                        <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                            {l.url}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    <div className="m-10">
                        {/* Summary */}
                        <section className="mb-6">
                            <h2 className="text-xl font-bold text-gray-700 border-b pb-1 mb-2">Professional Summary</h2>
                            <p className="text-sm leading-relaxed">{resume.summary}</p>
                        </section>

                        {/* Skills */}
                        <section className="mb-6">
                            <h2 className="text-xl font-bold text-gray-700 border-b pb-1 mb-2">Skills</h2>
                            <ul className="flex flex-wrap gap-2 text-sm">
                                {skills.map((s, i) => (
                                    <li key={i} className="bg-gray-100 px-3 py-1 rounded-full">{s.name}</li>
                                ))}
                            </ul>
                        </section>

                        {/* Experience */}
                        <section className="mb-6">
                            <h2 className="text-xl font-bold text-gray-700 border-b pb-1 mb-2">Experience</h2>
                            <section className="my-4">
                                {experience.map((exp, index) => (
                                    <div key={index} className="mb-4">
                                        <h3 className="text-lg font-medium">
                                            {exp.role} at {exp.company}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {exp.from_date} – {exp.currently_working ? 'Present' : exp.to_date}
                                        </p>
                                        {exp.description && (
                                            <p className="text-gray-800 text-sm">{exp.description}</p>
                                        )}
                                    </div>
                                ))}
                            </section>
                        </section>

                        {/* Certifications */}
                        <section className="mb-6">
                            <h2 className="text-xl font-bold text-gray-700 border-b pb-1 mb-2">Certifications</h2>
                            <ul className="list-disc list-inside text-sm">
                                {certifications.map((c, i) => (
                                    <li key={i}>{c.title}</li>
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
                    Download as Image
                </button>
            </div>
        </div>
    );
}
