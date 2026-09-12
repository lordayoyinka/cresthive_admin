import { useState, useEffect } from "react";
import {
  collection,
  getDoc,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { firestore as db } from "@/firebase/config";

// Converts a File object to a base64 string (without the data: prefix)
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// Uploads a file to the crestlandpage GitHub repo via our API route
// and returns a public CDN URL for it (no Firebase Storage involved) —
// same approach used for staff, director, and admin photos elsewhere.
const uploadToGitHub = async (file, folder, safeName) => {
  const contentBase64 = await fileToBase64(file);
  const ext = file.name.split(".").pop();
  const filename = `${safeName}.${ext}`;

  const res = await fetch("/api/upload-to-github", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder, filename, contentBase64 }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`GitHub upload failed: ${errText}`);
  }

  const { url } = await res.json();
  return url;
};

const CmsGallery = () => {
  const [galleryPageData, setGalleryPageData] = useState(null);
  const [isEditing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(null);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "cms", "galleryPage");
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists) {
          setGalleryPageData(docSnapshot.data());
          console.log("Document found", docSnapshot.data());
        } else {
          console.log("Document not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddImage = (categoryGallery, category) => {
    const updatedData = { ...galleryPageData };
    const newImage = { link: "", name: "New Image" };
    updatedData.gallery[categoryGallery][category].push(newImage);
    setGalleryPageData(updatedData);
  };

  const handleInputChange = (field, value) => {
    setGalleryPageData((prevData) => {
      const updatedData = { ...prevData };
      const keys = field.split(".");

      let currentLevel = updatedData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!currentLevel[keys[i]]) {
          currentLevel[keys[i]] = {};
        }
        currentLevel = currentLevel[keys[i]];
      }

      currentLevel[keys[keys.length - 1]] = value;
      return updatedData;
    });
  };

  // Admin types a direct image URL — used as-is, no upload needed. This
  // also clears any pending file selection for the same image, so the two
  // input methods don't fight over which one wins at Save time.
  const handleUrlInputChange = (categoryGallery, category, imageGallery, url) => {
    setGalleryPageData((prevData) => {
      const updatedData = { ...prevData };
      updatedData.gallery[categoryGallery][category][imageGallery].link = url;
      return updatedData;
    });
  };

  // Admin picks a file instead — just holds the File object in state until
  // Save is clicked (same pattern as staff/director photos elsewhere), so
  // nothing uploads to GitHub until the admin actually confirms the save.
  const handleFileInputChange = (categoryGallery, category, imageGallery, file) => {
    if (!file) return;
    setGalleryPageData((prevData) => {
      const updatedData = { ...prevData };
      updatedData.gallery[categoryGallery][category][imageGallery].link = file;
      return updatedData;
    });
  };

  // An image's `link` can be: a saved URL string, a manually pasted URL
  // string, or a pending File object waiting to be uploaded on Save.
  const getPreviewSrc = (link) => {
    if (!link) return "";
    if (link instanceof File) return URL.createObjectURL(link);
    return link;
  };

  const handleDeleteImage = (categoryGallery, category, imageGallery) => {
    const updatedData = { ...galleryPageData };
    updatedData.gallery[categoryGallery][category].splice(imageGallery, 1);
    setGalleryPageData(updatedData);
  };

  const handleSaveChanges = async () => {
    setSaveError(null);

    // Find every image across every category whose link is still a pending
    // File (i.e. picked via the file input, not a pasted URL) so we know
    // how many uploads to report progress for.
    const pendingUploads = [];
    galleryPageData.gallery.forEach((categoryObj, categoryIndex) => {
      const category = Object.keys(categoryObj)[0];
      categoryObj[category].forEach((image, imageIndex) => {
        if (image.link instanceof File) {
          pendingUploads.push({ categoryIndex, category, imageIndex });
        }
      });
    });

    setIsSaving(true);
    setSaveProgress(
      pendingUploads.length > 0
        ? { total: pendingUploads.length, done: 0 }
        : null
    );

    try {
      const updatedData = { ...galleryPageData };

      await Promise.all(
        pendingUploads.map(async ({ categoryIndex, category, imageIndex }) => {
          const file = updatedData.gallery[categoryIndex][category][imageIndex].link;
          const safeName = `${category}-${imageIndex}-${Date.now()}`;
          const url = await uploadToGitHub(file, `gallery/${category}`, safeName);
          updatedData.gallery[categoryIndex][category][imageIndex].link = url;
          setSaveProgress((prev) =>
            prev ? { ...prev, done: prev.done + 1 } : prev
          );
        })
      );

      const docRef = doc(db, "cms", "galleryPage");
      await setDoc(docRef, updatedData);
      setGalleryPageData(updatedData);
      setEditing(false);
      console.log("Data saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      setSaveError(
        "Save failed — one or more images didn't upload. Nothing was changed on the live site. Please try again."
      );
    } finally {
      setIsSaving(false);
      setSaveProgress(null);
    }
  };

  return (
    <div className="container mx-auto px-6 overflow-y-auto h-full pb-40 my-8">
      <h1 className="text-4xl font-bold mb-4">CMS Gallery Page</h1>
      {galleryPageData &&
        galleryPageData.gallery.map((category, categoryGallery) => (
          <div key={categoryGallery} className="mb-4">
            <h3 className="text-2xl font-semibold capitalize my-6 mb-2">
              {Object.keys(category)[0]}
            </h3>

            <div className="flex flex-wrap gap-4">
              {Object.keys(category)[0] &&
                category[Object.keys(category)[0]].map((image, imageGallery) => (
                  <div key={imageGallery} className="flex flex-col items-center mb-4 w-48">
                    <img
                      src={getPreviewSrc(image.link)}
                      alt={image.name}
                      className="rounded-md w-36 h-36 object-cover"
                    />
                    <div className="flex flex-col gap-2 mt-2 w-full">
                      {isEditing && (
                        <>
                          <label className="text-xs text-gray-600">
                            Paste image URL
                          </label>
                          <input
                            type="text"
                            placeholder="https://..."
                            className="border-b-2 w-full border-blue-500 focus:outline-none text-sm"
                            value={image.link instanceof File ? "" : image.link || ""}
                            onChange={(e) =>
                              handleUrlInputChange(
                                categoryGallery,
                                Object.keys(category)[0],
                                imageGallery,
                                e.target.value
                              )
                            }
                          />

                          <label className="text-xs text-gray-600">
                            Or upload a file (saved to GitHub)
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileInputChange(
                                categoryGallery,
                                Object.keys(category)[0],
                                imageGallery,
                                e.target.files[0]
                              )
                            }
                          />
                        </>
                      )}

                      {isEditing ? (
                        <textarea
                          className="border-b-2 w-full border-blue-500 focus:outline-none text-sm"
                          value={image.name}
                          onChange={(e) =>
                            handleInputChange(
                              `gallery.${categoryGallery}.${Object.keys(category)[0]}.${imageGallery}.name`,
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        <span className="text-sm">{image.name}</span>
                      )}

                      {isEditing && (
                        <button
                          onClick={() =>
                            handleDeleteImage(
                              categoryGallery,
                              Object.keys(category)[0],
                              imageGallery
                            )
                          }
                          className="bg-red-500 text-white py-1 px-2 rounded text-sm"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            {isEditing && (
              <button
                onClick={() =>
                  handleAddImage(categoryGallery, Object.keys(category)[0])
                }
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Add Image
              </button>
            )}
          </div>
        ))}

      <div className="flex flex-col items-end gap-2 flex-1 p-4">
        {saveError && (
          <p className="text-red-600 text-sm max-w-md text-right">{saveError}</p>
        )}
        {isSaving && (
          <p className="text-sm text-gray-600">
            {saveProgress
              ? `Uploading images to GitHub... (${saveProgress.done}/${saveProgress.total})`
              : "Saving..."}{" "}
            Please don't close or navigate away.
          </p>
        )}

        {isEditing ? (
          <button
            className={`py-2 px-4 rounded text-white ${
              isSaving ? "bg-green-300 cursor-not-allowed" : "bg-green-500"
            }`}
            onClick={handleSaveChanges}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        ) : (
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default CmsGallery;
