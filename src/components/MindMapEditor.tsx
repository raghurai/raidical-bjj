'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon, 
  TrashIcon, 
  LinkIcon,
  XMarkIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import GlassCard from './ui/GlassCard';
import Button from './ui/Button';

interface Node {
  id: string;
  title: string;
  x: number;
  y: number;
  moveId?: string;
}

interface Edge {
  id: string;
  from: string;
  to: string;
}

interface MindMapEditorProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onSave?: (nodes: Node[], edges: Edge[]) => void;
}

export default function MindMapEditor({ 
  initialNodes = [], 
  initialEdges = [],
  onSave 
}: MindMapEditorProps) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [showAddNode, setShowAddNode] = useState(false);
  const [newNodeTitle, setNewNodeTitle] = useState('');
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setCanvasSize({ width: rect.width, height: rect.height });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  const addNode = (x: number, y: number) => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      title: newNodeTitle || 'New Node',
      x: x - 100, // Center the node
      y: y - 30,
    };
    setNodes([...nodes, newNode]);
    setNewNodeTitle('');
    setShowAddNode(false);
  };

  const deleteNode = (nodeId: string) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    setEdges(edges.filter(e => e.from !== nodeId && e.to !== nodeId));
    setSelectedNode(null);
  };

  const updateNode = (nodeId: string, updates: Partial<Node>) => {
    setNodes(nodes.map(n => n.id === nodeId ? { ...n, ...updates } : n));
  };

  const startConnection = (nodeId: string) => {
    if (isConnecting && connectionStart) {
      // Complete connection
      if (connectionStart !== nodeId) {
        const newEdge: Edge = {
          id: `edge-${Date.now()}`,
          from: connectionStart,
          to: nodeId,
        };
        setEdges([...edges, newEdge]);
      }
      setIsConnecting(false);
      setConnectionStart(null);
    } else {
      // Start new connection
      setIsConnecting(true);
      setConnectionStart(nodeId);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (showAddNode) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        addNode(e.clientX - rect.left, e.clientY - rect.top);
      }
    } else if (!isConnecting) {
      setSelectedNode(null);
    }
  };

  const handleNodeDrag = (nodeId: string, e: React.MouseEvent) => {
    if (draggedNode !== nodeId) {
      setDraggedNode(nodeId);
    }
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      updateNode(nodeId, { x, y });
    }
  };

  const handleNodeMouseUp = () => {
    setDraggedNode(null);
  };

  const renderEdge = (edge: Edge) => {
    const fromNode = nodes.find(n => n.id === edge.from);
    const toNode = nodes.find(n => n.id === edge.to);
    
    if (!fromNode || !toNode) return null;

    return (
      <svg
        key={edge.id}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <line
          x1={fromNode.x + 100}
          y1={fromNode.y + 30}
          x2={toNode.x + 100}
          y2={toNode.y + 30}
          stroke="#6366f1"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      </svg>
    );
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowAddNode(!showAddNode)}
              className="flex items-center space-x-2"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Node</span>
            </Button>
            
            <Button
              variant={isConnecting ? 'primary' : 'secondary'}
              onClick={() => {
                setIsConnecting(!isConnecting);
                setConnectionStart(null);
              }}
              className="flex items-center space-x-2"
            >
              <LinkIcon className="w-4 h-4" />
              <span>{isConnecting ? 'Cancel' : 'Connect'}</span>
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {nodes.length} nodes, {edges.length} connections
            </span>
            {onSave && (
              <Button onClick={() => onSave(nodes, edges)}>
                Save Mind Map
              </Button>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Canvas */}
      <GlassCard className="p-0 overflow-hidden">
        <div
          ref={canvasRef}
          className="relative w-full h-96 bg-gradient-to-br from-gray-50 to-gray-100 cursor-crosshair"
          onClick={handleCanvasClick}
          style={{ minHeight: '600px' }}
        >
          {/* Grid background */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />

          {/* Edges */}
          {edges.map(renderEdge)}

          {/* Nodes */}
          <AnimatePresence>
            {nodes.map((node) => (
              <motion.div
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className={`absolute cursor-move select-none ${
                  selectedNode === node.id ? 'ring-2 ring-primary-500' : ''
                } ${isConnecting && connectionStart === node.id ? 'ring-2 ring-green-500' : ''}`}
                style={{
                  left: node.x,
                  top: node.y,
                  zIndex: 10
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setSelectedNode(node.id);
                  handleNodeDrag(node.id, e);
                }}
                onMouseUp={handleNodeMouseUp}
                onMouseMove={(e) => {
                  if (draggedNode === node.id) {
                    handleNodeDrag(node.id, e);
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isConnecting) {
                    startConnection(node.id);
                  } else {
                    setSelectedNode(node.id);
                  }
                }}
              >
                <GlassCard className="p-3 min-w-48">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {node.title}
                    </h3>
                    <div className="flex space-x-1">
                      {node.moveId && (
                        <BookOpenIcon className="w-4 h-4 text-blue-600" />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNode(node.id);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {node.moveId && (
                    <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      Connected to move
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add Node Input */}
          {showAddNode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-4 left-4 z-20"
            >
              <GlassCard className="p-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Add New Node</h3>
                  <input
                    type="text"
                    value={newNodeTitle}
                    onChange={(e) => setNewNodeTitle(e.target.value)}
                    placeholder="Node title..."
                    className="w-full px-3 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addNode(200, 100);
                      } else if (e.key === 'Escape') {
                        setShowAddNode(false);
                        setNewNodeTitle('');
                      }
                    }}
                  />
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={() => addNode(200, 100)}>
                      Add
                    </Button>
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      onClick={() => {
                        setShowAddNode(false);
                        setNewNodeTitle('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Instructions */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <LinkIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Create your first node</p>
                <p className="text-sm">Click "Add Node" to start building your mind map</p>
              </div>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
