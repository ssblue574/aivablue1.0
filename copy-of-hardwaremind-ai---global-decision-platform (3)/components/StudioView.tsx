import React, { useState } from 'react';
import { Wand2, Layers, Upload, Image as ImageIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { AspectRatio } from '../data';
import { generateAIImage, editAIImage } from '../services/geminiService';

interface StudioViewProps {
    t: (key: any) => string;
}

export const StudioView: React.FC<StudioViewProps> = ({ t }) => {
    const [mode, setMode] = useState<'generate' | 'edit'>('generate');
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    const handleSaveToGallery = () => {
        if (resultImage) {
            const link = document.createElement('a');
            link.href = resultImage;
            link.download = `aiva-studio-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsProcessing(true);
        const res = await generateAIImage(prompt, aspectRatio);
        setResultImage(res);
        setIsProcessing(false);
    };

    const handleEdit = async () => {
        if (!prompt || !uploadedImage) return;
        setIsProcessing(true);
        const res = await editAIImage(uploadedImage, prompt);
        setResultImage(res);
        setIsProcessing(false);
    };

    // File Upload Handler
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setUploadedImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Sidebar Controls */}
                <div className="lg:col-span-4 bg-[#1c1c1e] rounded-[32px] p-8 border border-white/10 h-fit">
                    <div className="flex gap-2 p-1 bg-black rounded-full mb-8 border border-white/10">
                        <button onClick={() => setMode('generate')} className={clsx("flex-1 py-3 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2", mode === 'generate' ? "bg-white text-black" : "text-gray-500")}>
                            <Wand2 size={16} /> {t('studio_tab_gen')}
                        </button>
                        <button onClick={() => setMode('edit')} className={clsx("flex-1 py-3 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2", mode === 'edit' ? "bg-white text-black" : "text-gray-500")}>
                            <Layers size={16} /> {t('studio_tab_edit')}
                        </button>
                    </div>

                    {mode === 'generate' && (
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-4">Aspect Ratio</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['1:1', '3:4', '4:3', '16:9', '9:16'].map(r => (
                                        <button key={r} onClick={() => setAspectRatio(r as AspectRatio)} className={clsx("py-2 rounded-lg text-xs font-mono border", aspectRatio === r ? "border-[#FF4D00] text-[#FF4D00] bg-[#FF4D00]/10" : "border-white/10 text-gray-400")}>
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="w-full h-32 bg-black border border-white/10 rounded-xl p-4 text-white text-sm focus:border-white/30 outline-none resize-none"
                                placeholder={t('studio_prompt_placeholder')}
                            />
                            <button
                                onClick={handleGenerate}
                                disabled={isProcessing}
                                className="w-full py-4 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform disabled:opacity-50"
                            >
                                {isProcessing ? "Processing..." : t('btn_generate')}
                            </button>
                        </div>
                    )}

                    {mode === 'edit' && (
                        <div className="space-y-6">
                            <div className="border-2 border-dashed border-white/10 rounded-xl h-40 flex flex-col items-center justify-center text-gray-500 relative hover:border-white/30 transition-colors">
                                {uploadedImage ? (
                                    <img src={uploadedImage} className="w-full h-full object-contain p-2" alt="Uploaded" />
                                ) : (
                                    <>
                                        <Upload size={24} className="mb-2" />
                                        <span className="text-xs uppercase font-bold">{t('btn_upload')}</span>
                                    </>
                                )}
                                <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="w-full h-32 bg-black border border-white/10 rounded-xl p-4 text-white text-sm focus:border-white/30 outline-none resize-none"
                                placeholder={t('studio_edit_placeholder')}
                            />
                            <button
                                onClick={handleEdit}
                                disabled={isProcessing}
                                className="w-full py-4 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform disabled:opacity-50"
                            >
                                {isProcessing ? "Processing..." : "Apply Edit"}
                            </button>
                        </div>
                    )}
                </div>

                {/* Preview Area */}
                <div className="lg:col-span-8 bg-black border border-white/10 rounded-[32px] flex items-center justify-center relative overflow-hidden min-h-[500px]">
                    {isProcessing && (
                        <div className="absolute inset-0 z-10 bg-black/80 flex items-center justify-center flex-col gap-4 backdrop-blur-sm">
                            <div className="w-12 h-12 border-4 border-[#FF4D00] border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs font-mono text-[#FF4D00] animate-pulse">GENERATING PIXELS...</p>
                        </div>
                    )}
                    {resultImage ? (
                        <div className="relative group w-full h-full flex items-center justify-center">
                            <img src={resultImage} className="max-w-full max-h-full object-contain shadow-2xl" alt="Result" />
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button 
                                    onClick={handleSaveToGallery}
                                    className="px-4 py-2 bg-white text-black rounded-full text-sm font-bold shadow-xl hover:scale-105 transition-transform"
                                >
                                    Download
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-600">
                            <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="text-sm font-mono uppercase tracking-widest">Workspace Ready</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
