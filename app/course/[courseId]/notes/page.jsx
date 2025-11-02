// "use client";
// import { Button } from "@/components/ui/button";
// import axios from "axios";
// import { useParams, useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";

// function ViewNotes() {
//   const { courseId } = useParams();
//   const [notes, setNotes] = useState([]);
//   const [stepCount, setStepCount] = useState(0);
//   const router = useRouter();

//   const customStyles = {
//     h3: {
//       fontSize: "24px",
//       fontWeight: "600",
//       color: "#333",
//       marginBottom: "10px",
//     },
//     h4: {
//       fontSize: "20px",
//       fontWeight: "500",
//       color: "#444",
//       marginBottom: "8px",
//     },
//     p: {
//       fontSize: "16px",
//       color: "#555",
//       lineHeight: "1.6",
//       marginBottom: "12px",
//     },
//     p: {
//       fontSize: "16px",
//       color: "#555",
//       lineHeight: "1.6",
//       marginBottom: "12px",
//     },
//     li: {
//       fontSize: "16px",
//       color: "#555",
//       lineHeight: "1.6",
//       marginBottom: "12px",
//     },
//   };

//   useEffect(() => {
//     GetNotes();
//   }, []);

//   const GetNotes = async () => {
//     try {
//       const result = await axios.post("/api/study-type", {
//         courseId: courseId,
//         studyType: "notes",
//       });

//       // Parse the stringified `notes` field
//       const parsedNotes = result?.data?.notes.map((note) => ({
//         ...note,
//         notes: JSON.parse(note.notes),
//       }));

//       console.log("Parsed Notes:", parsedNotes); // Debug log
//       setNotes(parsedNotes || []);
//     } catch (error) {
//       console.error("Failed to fetch notes:", error);
//     }
//   };

//   const styleContent = (content) => {
//     return content
//       .replace(
//         /<h3>/g,
//         `<h3 style="font-size:24px; font-weight:600; color:#333; margin-bottom:10px;">`
//       )
//       .replace(
//         /<h4>/g,
//         `<h4 style="font-size:20px; font-weight:500; color:#444; margin-bottom:8px;">`
//       )
//       .replace(
//         /<p>/g,
//         `<p style="font-size:16px; color:#555; line-height:1.6; margin-bottom:12px;">`
//       )
//       .replace(
//         /<li>/g,
//         `<li style="font-size:16px; color:#555; line-height:1.6; margin-bottom:12px;">`
//       );
//   };

//   if (!Array.isArray(notes)) {
//     return <div>No notes available</div>;
//   }

//   return notes.length > 0 ? (
//     <div>
//       <div className="flex gap-5 items-center">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => setStepCount((prev) => Math.max(prev - 1, 0))}
//         >
//           Previous
//         </Button>
//         {notes.map((_, index) => (
//           <div
//             key={index}
//             className={`w-full h-2 rounded-full ${
//               index < stepCount ? "bg-primary" : "bg-gray-200"
//             }`}
//           ></div>
//         ))}
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() =>
//             setStepCount((prev) => Math.min(prev + 1, notes.length - 1))
//           }
//         >
//           Next
//         </Button>
//       </div>

//       <div className="mt-10">
//         <div
//           className="note-content"
//           dangerouslySetInnerHTML={{
//             __html: styleContent(notes[stepCount].notes.content),
//           }}
//         ></div>

//         {stepCount === notes.length - 1 && (
//           <div className="flex items-center gap-10 flex-col justify-center">
//             <h2>End of notes</h2>
//             <Button onClick={() => router.back()}>Go to course page</Button>
//           </div>
//         )}
//       </div>
//     </div>
//   ) : (
//     <div>No notes available</div>
//   );
// }

// export default ViewNotes;
"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function ViewNotes() {
  const { courseId } = useParams();
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadContent, setUploadContent] = useState("");
  const [summary, setSummary] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [stepCount, setStepCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    GetNotes();
  }, []);

  const GetNotes = async () => {
    try {
      const result = await axios.post("/api/study-type", {
        courseId: courseId,
        studyType: "notes",
      });

      // No need to parse notes as JSON if it's already HTML content.
      const parsedNotes = result?.data?.notes.map((note) => ({
        ...note,
        notes: note.notes, // Directly use the HTML string.
      }));

      console.log("Parsed Notes:", parsedNotes); // Debug log
      setNotes(parsedNotes || []);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  };

  const handleFile = async (file) => {
    if (!file) return;
    // Only handle text files for now (.txt, .md)
    if (file.type.startsWith("text/") || /\.md$|\.txt$/i.test(file.name)) {
      const text = await file.text();
      setUploadContent(text);
      setUploadTitle(file.name.replace(/\.(md|txt)$/i, ""));
      setSummary(null);
    } else {
      alert("Unsupported file type. Please upload a .txt or .md file for now.");
    }
  };

  const handleSummarize = async ({ save = false } = {}) => {
    if (!uploadContent || uploadContent.trim().length === 0) {
      alert("Please paste notes or upload a text/markdown file first.");
      return;
    }

    try {
      setUploadLoading(true);
      const resp = await axios.post("/api/notes/upload", {
        courseId,
        title: uploadTitle || `Manual note ${new Date().toISOString()}`,
        content: uploadContent,
        save,
      });

      if (resp?.data?.error) {
        alert(`Error: ${resp.data.error}`);
      } else {
        setSummary(resp.data?.summary ?? null);
        // If saved, refresh notes list
        if (save) {
          await GetNotes();
          setUploadContent("");
          setUploadTitle("");
        }
      }
    } catch (e) {
      console.error(e);
      alert("Failed to summarize notes. See console for details.");
    } finally {
      setUploadLoading(false);
    }
  };

  const styleContent = (content) => {
    content = content
      .replace(/^```html/g, "")
      .replace(/'''$/g, "")
      .trim();
    return content
      .replace(
        /<h3>/g,
        `<h3 style="font-size:24px; font-weight:600; color:#333; margin-bottom:10px;">`
      )
      .replace(
        /<h4>/g,
        `<h4 style="font-size:20px; font-weight:500; color:#444; margin-bottom:8px;">`
      )
      .replace(
        /<p>/g,
        `<p style="font-size:16px; color:#555; line-height:1.6; margin-bottom:12px;">`
      )
      .replace(
        /<li>/g,
        `<li style="font-size:16px; color:#555; line-height:1.6; margin-bottom:12px;">`
      );
  };

  if (!Array.isArray(notes)) {
    return <div>No notes available</div>;
  }

  return notes.length > 0 ? (
    <div>
      <div className="mb-8 p-4 border rounded-lg bg-white">
        <h3 className="text-lg font-semibold mb-2">Upload / Paste Notes</h3>
        <input
          type="text"
          placeholder="Title (optional)"
          value={uploadTitle}
          onChange={(e) => setUploadTitle(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <div className="flex gap-2 items-center mb-2">
          <input
            id="file-input"
            type="file"
            accept=".txt,.md,text/*"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <Button variant="outline" size="sm" onClick={() => { setUploadContent(''); setSummary(null); setUploadTitle(''); }}>
            Clear
          </Button>
        </div>
        <textarea
          rows={6}
          placeholder="Or paste notes here..."
          value={uploadContent}
          onChange={(e) => setUploadContent(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={() => handleSummarize({ save: false })} disabled={uploadLoading}>
            {uploadLoading ? "Summarizing…" : "Summarize (preview)"}
          </Button>
          <Button size="sm" onClick={() => handleSummarize({ save: true })} disabled={uploadLoading}>
            {uploadLoading ? "Saving…" : "Summarize & Save"}
          </Button>
        </div>

        {summary && (
          <div className="mt-4 p-3 bg-gray-50 border rounded">
            <h4 className="font-semibold">AI Summary</h4>
            <div className="mt-2">
              <p className="mb-2">{summary.summary}</p>
              {Array.isArray(summary.bullets) && (
                <ul className="list-disc pl-6">
                  {summary.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-5 items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStepCount((prev) => Math.max(prev - 1, 0))}
        >
          Previous
        </Button>
        {notes.map((_, index) => (
          <div
            key={index}
            className={`w-full h-2 rounded-full ${
              index < stepCount ? "bg-primary" : "bg-gray-200"
            }`}
          ></div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setStepCount((prev) => Math.min(prev + 1, notes.length - 1))
          }
        >
          Next
        </Button>
      </div>

      <div className="mt-10">
        <div
          className="note-content"
          dangerouslySetInnerHTML={{
            __html: styleContent(notes[stepCount].notes),
          }}
        ></div>

        {stepCount === notes.length - 1 && (
          <div className="flex items-center gap-10 flex-col justify-center">
            <h2>End of notes</h2>
            <Button onClick={() => router.back()}>Go to course page</Button>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div>No notes available</div>
  );
}

export default ViewNotes;
