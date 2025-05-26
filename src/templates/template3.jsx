import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

export default function Template3({ resume, skills, education, experience, certifications, links }) {
    const resumeRef = useRef();
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/intropage?resumeId=${resume.id}`);
    };
    const handleDownload = async () => {
        if (!resumeRef.current) return;

        try {
            // Hide buttons and other elements you don't want in the image
            const originalStyles = {
                overflow: resumeRef.current.style.overflow,
            };
            resumeRef.current.style.overflow = 'visible';

            const dataUrl = await htmlToImage.toPng(resumeRef.current, {
                quality: 1,
                pixelRatio: 2, // Higher resolution
                backgroundColor: '#ffffff',
                style: {
                    transform: 'none', // Disable any transforms
                }
            });

            const link = document.createElement('a');
            link.download = `${resume.full_name}-resume.png`;
            link.href = dataUrl;
            link.click();

            // Restore original styles
            resumeRef.current.style.overflow = originalStyles.overflow;
        } catch (error) {
            console.error('Error generating image', error);
        }
    };

    return (
        <div>
            <div ref={resumeRef} className="resume-container">
                <div className="max-w-3xl mx-auto mb-2 bg-white p-10 shadow-xl rounded-lg text-gray-900 font-serif">
                    {/* Header */}
                    <div className="text-center border-b pb-4 mb-6">
                        <h1 className="text-4xl font-bold uppercase tracking-wide">{resume.full_name}</h1>
                        <p className="text-md text-gray-600 mt-1">{resume.phone} | {resume.email}</p>
                    </div>

                    {/* Summary */}
                    <section className="mb-6">
                        <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2 text-blue-800">Professional Summary</h2>
                        <p className="text-sm leading-relaxed">{resume.summary}</p>
                    </section>

                    {/* Skills */}
                    <section className="mb-6">
                        <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2 text-blue-800">Skills</h2>
                        <ul className="flex flex-wrap gap-2 text-sm">
                            {skills.map((s, i) => (
                                <li key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{s.name}</li>
                            ))}
                        </ul>
                    </section>

                    {/* Education */}
                    <section className="mb-6">
                        <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2 text-blue-800">Education</h2>
                        {education.map((edu, i) => (
                            <div key={i} className="mb-3">
                                <p className="font-semibold">{edu.institution}</p>
                                <p className="text-sm text-gray-600">{edu.from_date} – {edu.to_date}</p>
                            </div>
                        ))}
                    </section>

                    {/* Experience */}
                    <section className="mb-6">
                        <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2 text-blue-800">Experience</h2>
                        {experience.map((exp, i) => (
                            <div key={i} className="mb-3">
                                <p className="font-semibold">{exp.role} at {exp.company}</p>
                                <p className="text-sm text-gray-600">{exp.from_date} – {exp.to_date}</p>
                            </div>
                        ))}
                    </section>

                    {/* Certifications */}
                    <section className="mb-6">
                        <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2 text-blue-800">Certifications</h2>
                        <ul className="list-disc list-inside text-sm">
                            {certifications.map((c, i) => (
                                <li key={i}>{c.title}</li>
                            ))}
                        </ul>
                    </section>

                    {/* Links */}
                    <section>
                        <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2 text-blue-800">Links</h2>
                        <ul className="list-disc list-inside text-sm">
                            {links.map((l, i) => (
                                <li key={i}>
                                    <span className="font-semibold">{l.label}:</span>{" "}
                                    <a
                                        href={l.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-700 underline"
                                    >
                                        {l.url}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </section>
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
