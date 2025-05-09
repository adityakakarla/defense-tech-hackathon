"use client"

import React, { useState, useEffect, ChangeEvent, useRef } from "react"
import { ChevronLeft, ChevronRight, ArrowUp, Volume2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useChat } from '@ai-sdk/react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'

export default function Sidebar({ data }: { data: any }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [width, setWidth] = useState(384) // Default width (96px * 4 = 384px)
    const { messages, input, handleInputChange, handleSubmit } = useChat({});
    const sidebarRef = useRef<HTMLDivElement>(null)
    const isDraggingRef = useRef(false)
    const initialXRef = useRef(0)
    const initialWidthRef = useRef(0)
    const currentWidthRef = useRef(width)
    const [model, setModel] = useState("gpt-4o-mini")
    const [isAudioLoading, setIsAudioLoading] = useState(false)
    const modelOptions = [
        'gpt-4o-mini',
        'gpt-4o',
        'claude-3.5-sonnet',
        'claude-3.7-sonnet'
    ]

    // Keep currentWidthRef in sync with width state
    useEffect(() => {
        currentWidthRef.current = width;
    }, [width]);

    const toggleSidebar = () => {
        setIsExpanded(prev => !prev)
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && (event.key === 'm' || event.key === 'M')) {
                event.preventDefault()
                toggleSidebar()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    const ta = useRef<HTMLTextAreaElement>(null);

    const onInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        const el = e.currentTarget;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
        handleInputChange(e as ChangeEvent<HTMLTextAreaElement>);
    };

    // Handle drag resize functionality with optimized performance
    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            if (!isExpanded) return;
            isDraggingRef.current = true;
            initialXRef.current = e.clientX;
            initialWidthRef.current = currentWidthRef.current;
            document.body.style.cursor = 'ew-resize';
            document.body.style.userSelect = 'none'; // Prevent text selection during drag
            e.preventDefault();
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDraggingRef.current) return;
            const deltaX = initialXRef.current - e.clientX;
            let newWidth = initialWidthRef.current + deltaX;
            newWidth = Math.max(newWidth, 256);
            newWidth = Math.min(newWidth, 1000);

            if (sidebarRef.current) {
                sidebarRef.current.style.width = `${newWidth}px`;
                currentWidthRef.current = newWidth;
            }
        };

        const handleMouseUp = () => {
            if (isDraggingRef.current) {
                isDraggingRef.current = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';

                // Sync the state with currentWidth only when done dragging
                setWidth(currentWidthRef.current);
            }
        };

        // Add the resize handle events
        const resizeHandle = document.getElementById('sidebar-resize-handle');
        resizeHandle?.addEventListener('mousedown', handleMouseDown);

        // Add document-level event listeners
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            resizeHandle?.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isExpanded]);

    return (
        <div className="flex h-screen">
            {/* Resize handle - positioned on left side */}
            {isExpanded && (
                <div
                    id="sidebar-resize-handle"
                    className="relative w-1 h-full cursor-ew-resize hover:bg-blue-400 active:bg-blue-500 z-50"
                    title="Drag to resize"
                >
                    <div className="absolute inset-y-0 -left-2 -right-2" />
                </div>
            )}

            <div
                ref={sidebarRef}
                className={cn(
                    "flex h-screen max-h-screen flex-col border-r bg-card overflow-hidden",
                    isExpanded ? "" : "w-12 transition-all duration-300 ease-in-out",
                )}
                style={{ width: isExpanded ? `${width}px` : '48px' }}
            >
                <div className="relative flex h-14 min-h-[3.5rem] items-center justify-center p-1 shrink-0">
                    <button
                        onClick={toggleSidebar}
                        className="absolute left-4 text-muted-foreground hover:text-foreground"
                    >
                        {isExpanded ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                    </button>
                    {isExpanded && <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">Agent</h2>
                        <button
                            disabled={isAudioLoading}
                            className="hover:text-gray-600 transition duration-150 flex items-center justify-center"
                            onClick={async () => {
                                try {
                                    setIsAudioLoading(true);
                                    const response = await fetch("/api/dispatch", {
                                        method: "POST",
                                        body: JSON.stringify({
                                            messages: messages
                                        })
                                    });
                                    const audio = await response.blob();
                                    console.log('blob');
                                    const audioUrl = URL.createObjectURL(audio);
                                    console.log('audioUrl');
                                    const audioElement = new Audio(audioUrl);
                                    console.log('audioElement');
                                    await audioElement.play();
                                    console.log('Playback started successfully.');
                                    console.log('audioElement.play()');
                                } catch (error) {
                                    console.error('Playback failed:', error);
                                } finally {
                                    setIsAudioLoading(false);
                                }
                            }}
                        >
                            {isAudioLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Volume2 className="h-5 w-5" />
                            )}
                        </button>
                    </div>}
                </div>

                {isExpanded && (
                    <div className="flex flex-col flex-1 h-[calc(100vh-3.5rem)] overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-3">
                            {messages.map(message => (
                                <div 
                                    key={message.id} 
                                    className={`border p-3 rounded-lg shadow-sm ${
                                        message.role === 'user' 
                                            ? 'border-gray-300 bg-white' 
                                            : 'border-l-4 border-blue-400 border-r border-t border-b bg-white'
                                    }`}
                                >
                                    <div className={`font-semibold mb-1 text-sm ${
                                        message.role === 'user' 
                                            ? 'text-gray-700' 
                                            : 'text-blue-700'
                                    }`}>
                                        {message.role === 'user' ? 'You' : 'Assistant'}
                                    </div>
                                    {message.role === 'user' ? (
                                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                                    ) : (
                                        <div className="text-sm">
                                            <ReactMarkdown 
                                                components={{
                                                    // Basic list styling
                                                    ul: ({node, children, ...props}) => <ul className="list-disc pl-4 mb-2 mt-1" {...props}>{children}</ul>,
                                                    ol: ({node, children, ...props}) => <ol className="list-decimal pl-4 mb-2 mt-1" {...props}>{children}</ol>,
                                                    li: ({node, children, ...props}) => <li className="mb-1" {...props}>{children}</li>,
                                                    // Simple code styling
                                                    code: ({node, inline, children, ...props}: any) => 
                                                        inline ? 
                                                            <code className="bg-gray-100 px-1 py-0.5 rounded font-mono" {...props}>{children}</code> : 
                                                            <pre className="bg-gray-100 p-2 rounded font-mono whitespace-pre-wrap overflow-x-auto my-2"><code {...props}>{children}</code></pre>,
                                                    // Simple heading styling
                                                    h1: ({node, children, ...props}) => <h1 className="text-xl font-bold mt-3 mb-2" {...props}>{children}</h1>,
                                                    h2: ({node, children, ...props}) => <h2 className="text-lg font-bold mt-3 mb-2" {...props}>{children}</h2>,
                                                    h3: ({node, children, ...props}) => <h3 className="text-base font-bold mt-2 mb-1" {...props}>{children}</h3>,
                                                    // Simple paragraph styling
                                                    p: ({node, children, ...props}) => <p className="mb-2" {...props}>{children}</p>,
                                                    // Simple blockquote styling
                                                    blockquote: ({node, children, ...props}) => <blockquote className="border-l-4 border-gray-300 pl-2 py-1 italic text-gray-700 my-2" {...props}>{children}</blockquote>,
                                                    // Bold text
                                                    strong: ({node, children, ...props}) => <strong className="font-bold" {...props}>{children}</strong>,
                                                    // Italic text
                                                    em: ({node, children, ...props}) => <em className="italic" {...props}>{children}</em>
                                                }}
                                            >
                                                {message.content}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="p-2 border-t shrink-0">
                            <Select onValueChange={(value) => setModel(value)} defaultValue="gpt-4o-mini">
                                <SelectTrigger className="w-[180px] rounded-none border border-black text-black my-2">
                                    <SelectValue placeholder="Model" className="text-black" />
                                </SelectTrigger>
                                <SelectContent>
                                    {modelOptions.map(option => (
                                        <SelectItem key={option} value={option}>{option}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <form
                                onSubmit={event => {
                                    handleSubmit(event, {
                                        body: {
                                            data: data,
                                            model: model
                                        },
                                    });
                                }}
                                className="flex items-start gap-2"
                            >


                                <textarea
                                    ref={ta}
                                    name="prompt"
                                    value={input}
                                    onInput={onInput}
                                    className="
                    flex-1
                    border border-black
                    p-2
                    resize-none
                    overflow-auto
                    max-h-40
                  "
                                    rows={1}
                                    placeholder="Type your message…"
                                />
                                <button
                                    type="submit"
                                    className="
                    self-end
                    flex items-center justify-center
                    w-10 h-10
                    border border-black
                    rounded
                  "
                                >
                                    <ArrowUp className="h-5 w-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
