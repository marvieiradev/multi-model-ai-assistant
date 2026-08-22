import { useEffect, useMemo, useRef, useState } from "react";
import { API_URL, fallbackHeaders, MAX_FILE_CHARS } from "./constants/api";
import {
  MODELS,
  NOVA_FILE_MODEL_ID,
  VISION_MODEL_IDS,
} from "./constants/models";
import AssistantResponse from "./components/AssistantResponse";
import ErrorBanner from "./components/ErrorBanner";
import Header from "./components/Header";
import PromptForm from "./components/PromptForm";
import QuickActions from "./components/QuickActions";

function App() {
  const [selectdedModel, setSelectedModel] = useState(MODELS[0]);
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [displayedAnswer, setDisplayedAnswer] = useState("");
  const [imageData, setImageData] = useState(null);
  const [fileAttachment, setFileAttachment] = useState(null);

  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiHeaders = useMemo(() => {
    const key = import.meta.env.OPENROUTER_API_KEY;
    const referer = typeof window != "undefined" ? window.location.origin : "";
    return {
      ...fallbackHeaders,
      ...(referer ? { "HTTP-Referer": referer } : {}),
      ...API_URL(key ? { Authorization: `Bearer ${key}` } : {}),
    };
  }, []);

  const isVisionModel = useMemo(
    () => VISION_MODEL_IDS.has(selectdedModel.id),
    [selectdedModel.id],
  );
  const isNovaFileModel = useMemo(
    () => selectdedModel.id === NOVA_FILE_MODEL_ID,
    [selectdedModel.id],
  );

  const clearImage = () => {
    setImageData(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const clearFile = () => {
    setFileAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetAttachments = () => {
    clearImage();
    clearFile();
  };

  const clearAll = () => {
    setPrompt("");
    resetAttachments();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImageData(reader.result);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError(
        "Arquivo muito grande, por favor utilize um arquivo menor que 2MB.",
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const content = typeof reader.result === "string" ? reader.result : "";
      const truncated = content.slice(0, MAX_FILE_CHARS);
      const notice =
        content.length > MAX_FILE_CHARS
          ? "\n\n[Content trucated to avoid excedind model limits,]"
          : "";

      setFileAttachment({
        name: file.name,
        content: `${truncated}${notice}`,
      });
      setError("");
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    if (!isNovaFileModel) {
      clearFile();
    }
  }, [isNovaFileModel]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const hasText = !!prompt.trim();
    const hasImage = !!imageData;
    const hasFile = isNovaFileModel && !!fileAttachment?.content;

    if (loading) return;
    if (!hasText && !hasFile && (!isVisionModel || !hasImage)) return;

    setError("");
    setAnswer("");
    setDisplayedAnswer("");

    if (!apiHeaders.Authorization) {
      setError(
        "Adicione o OPENROUTER_API_KEY no seu arquivo .env para utilizar o modelo.",
      );
      return;
    }

    setLoading(true);

    try {
      const parts = [];
      const hasAttachment = isVisionModel && hasImage;
      const fallbackText =
        !hasText && (hasAttachment || hasFile)
          ? "Please analyze tha attached item(s)."
          : "";
      if (hasText || fallbackText) {
        parts.push({
          type: "text",
          text: hasText ? prompt.trim() : fallbackText,
        });
      }
      if (isVisionModel && hasImage) {
        parts.push({
          type: "image_url",
          image_url: {
            url: imageData,
          },
        });
      }

      if (hasFile) {
        parts.push({
          type: "text",
          text: `File: ${fileAttachment.name}\n\n${fileAttachment.content}`,
        });
      }

      const messageContent =
        parts.length > 0 ? parts : [{ type: "text", text: prompt.trim() }];

      const response = await fetch(API_URL, {
        headers: apiHeaders,
        body: JSON.stringify({
          model: selectdedModel.id,
          messages: [{ role: "user", content: messageContent }],
          stream: false,
        }),
      });
      if (!response.ok) {
        const errJson = await response.json.catch(() => null);
        const errMsg =
          errJson?.error?.message || response.statusText || "Request failed";
        throw new Error(errMsg);
      }

      const data = await response.json();
      const choice = data?.choices?.[0];

      if (choice?.error?.message) {
        throw new Error(choice.error.message);
      }

      let reply = choice?.message?.content;
      if (Array.isArray(reply)) {
        reply = reply
          .map((part) => {
            if (typeof part === "string") return part;
            if (part?.text) return part.text;
            if (part?.output_text) return part.output_text;
            return "";
          })
          .filter(Boolean)
          .join("\n");
      }

      if (!reply || (typeof reply === "string" && reply.trim() === "")) {
        const backendError =
          data?.error?.message || "No response from model (empty content)";
        throw new Error(backendError);
      }
      setAnswer(reply);
      resetAttachments();
    } catch (err) {
      setError(
        err?.message ||
          "Something went wrong. check your API key and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!answer) {
      setDisplayedAnswer("");
      return;
    }

    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setDisplayedAnswer(answer.slice(0, i));
      if (i >= answer.length) {
        clearInterval(id);
      }
    }, 12);
    return () => clearInterval(id);
  }, [answer]);

  const handleModelChange = (modelId) => {
    const nextModel = MODEL.find((model) => model.id === modelId);
    if (nextModel) setSelectedModel(nextModel);
  };

  const handleQuickActionSelect = (text) => setPrompt(text);

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
      <div className="realtive z-10 flex flex-col min-h-screen">
        <Header selectedModel={selectdedModel} />
        <main className="flex-1 flex items-center justify-center p-4 sm;p-6">
          <div className="w-full max-w-4xl space-y-4 sm:space-y-6">
            <ErrorBanner message={error} />
            <AssistantResponse
              answer={answer}
              displayedAnswer={displayedAnswer}
              selectedModel={selectdedModel}
            />
            <PromptForm
              prompt={prompt}
              onPromptChange={setPrompt}
              onSubmit={handleSubmit}
              onClearAll={clearAll}
              models={MODELS}
              selectModel={selectdedModel}
              onModelChange={handleModelChange}
              isVisionModel={isVisionModel}
              isNovaFileModel={isNovaFileModel}
              onImageChange={handleImageChange}
              onFileChange={handleFileChange}
              imageData={imageData}
              fileAttachment={fileAttachment}
              clearImage={clearImage}
              clearFile={clearFile}
              loading={loading}
              imageInputRef={imageInputRef}
              fileInputRef={fileInputRef}
            />
            <QuickActions onSelect={handleQuickActionSelect}/>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
