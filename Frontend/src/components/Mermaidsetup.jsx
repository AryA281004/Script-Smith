import React, { useRef, useEffect, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  securityLevel: "loose",
  theme: "default",
  flowchart: {
    htmlLabels: true,
    curve: "basis",
    nodeSpacing: 100,
    rankSpacing: 80,
    diagramMarginX: 40,
    diagramMarginY: 40,
    padding: 20
  },
  sequenceDiagram: {
    diagramMarginX: 40,
    diagramMarginY: 40,
    padding: 20
  }
});

const cleanChart = (diagram) => {
  if (!diagram) return "";

  let text = diagram.trim();

  // Remove BOM and zero-width characters
  text = text.replace(/^\uFEFF/, "").replace(/[\u200B\u200C\u200D\uFEFF]/g, "");

  // ⭐ CRITICAL: Remove orphaned "end" statements that aren't part of subgraphs
  // Pattern: "endC --> D" or "end" without preceding "subgraph" -> remove
  // First, split "endC" into separate lines if present
  text = text.replace(/\bend([A-Za-z0-9_])/g, "end\n$1");

  // ⭐ AGGRESSIVE: Extract graph type
  const graphMatch = text.match(/^(graph\s+\w+|sequenceDiagram|\w+)/i);
  const graphType = graphMatch ? graphMatch[1] : "graph TD";
  
  // ⭐ AGGRESSIVE: Parse nodes and subgraphs line by line
  const lines = text.split("\n");
  const cleaned = [];
  let inSubgraph = false;
  let subgraphStack = 0; // Track nested subgraphs
  
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    
    // ⭐ SKIP: Orphaned "end" without matching subgraph
    if (/^end\s*$/i.test(line)) {
      if (inSubgraph && subgraphStack > 0) {
        cleaned.push("end");
        subgraphStack--;
        if (subgraphStack === 0) inSubgraph = false;
      }
      // Skip orphaned ends
      continue;
    }
    
    // Handle subgraph declarations
    if (/^subgraph\s+/i.test(line)) {
      // Extract subgraph ID and title: "subgraph ID["Title"]" pattern
      const subMatch = line.match(/subgraph\s+([A-Za-z0-9_]+)\s*\["([^"]*)"\]/i);
      
      if (subMatch) {
        const [, id, title] = subMatch;
        cleaned.push(`subgraph ${id}["${title}"]`);
        inSubgraph = true;
        subgraphStack++;
      } else {
        // Fallback: try to extract just the ID
        const idMatch = line.match(/subgraph\s+([A-Za-z0-9_]+)/i);
        if (idMatch) {
          const id = idMatch[1];
          cleaned.push(`subgraph ${id}["${id}"]`);
          inSubgraph = true;
          subgraphStack++;
        }
      }
      continue;
    }
    
    // Handle node declarations with labels
    // Pattern: NodeID["Label"]Extra"]Stuff] -> extract NodeID and Label only
    const nodeMatch = line.match(/^([A-Za-z0-9_]+)\s*\[\s*"([^"]*)"\s*\]/);
    
    if (nodeMatch) {
      const [, nodeId, label] = nodeMatch;
      // Clean label: remove stray brackets and quotes
      let cleanLabel = label
        .replace(/[\[\]"]/g, "") // Remove brackets and quotes
        .replace(/\s+/g, " ") // Normalize spaces
        .trim();
      
      if (!cleanLabel) cleanLabel = nodeId;
      
      cleaned.push(`${nodeId}["${cleanLabel}"]`);
      continue;
    }
    
    // Handle arrow connections
    if (line.includes("-->") || line.includes("<-->") || line.includes("<--")) {
      // Extract node IDs from connection
      const connMatch = line.match(/^([A-Za-z0-9_]+)\s*(<?--+>?)\s*([A-Za-z0-9_]+)/);
      if (connMatch) {
        const [, from, arrow, to] = connMatch;
        try {
          // Normalize arrow to -->
          const normalArrow = "-->" ;  // Always use forward arrow for consistency
          cleaned.push(`${from} ${normalArrow} ${to}`);
        } catch (e) {
          // Skip malformed connections
        }
      }
      continue;
    }
    
    // Skip any other malformed lines
  }
  
  // Rebuild final diagram
  text = `${graphType}\n` + cleaned.join("\n");

  // ⭐ Final sanitation: Remove any remaining stray brackets, quotes, duplicates
  text = text.split("\n").map(line => {
    if (line.includes("[")) {
      // Remove trailing stray characters after proper node declaration
      // Pattern: NodeID["Label"]garbage -> keep only NodeID["Label"]
      line = line.replace(/(\]\s*).+$/m, "$1");
    }
    return line;
  }).join("\n");

  return text;
};


const Mermaidsetup = ({ diagram }) => {
  const containerRef = useRef(null);
  const [caption, setCaption] = useState("");

  const extractCaption = (text) => {
    if (!text) return "";

    const titleMatch = text.match(/^\s*title\s+(.+)$/im);
    if (titleMatch) return titleMatch[1].trim();

    const commentMatch = text.match(/^\s*%%\s*title[:\-]?\s*(.+)$/im);
    if (commentMatch) return commentMatch[1].trim();

    const nodeMatch = text.match(/\[([^\]]+)\]/);
    if (nodeMatch) return nodeMatch[1].trim();

    return "";
  };

  useEffect(() => {
    if (!diagram || !containerRef.current) return;

    const renderMermaid = async () => {
      const el = containerRef.current;
      if (!el) return;

      el.innerHTML = "";

      const id = "mermaid-" + Math.random().toString(36).slice(2);

      const safeChart = cleanChart(diagram);

      const computedCaption = extractCaption(safeChart);

      try {
        const { svg } = await mermaid.render(id, safeChart);

        el.innerHTML = svg;
        // Make rendered SVG responsive for mobile
        const svgEl = el.querySelector('svg');
        if (svgEl) {
          svgEl.setAttribute('width', '100%');
          svgEl.removeAttribute('height');
          svgEl.style.height = 'auto';
          // Slightly increase font size on small screens
          if (window && window.innerWidth && window.innerWidth < 480) {
            svgEl.style.fontSize = '14px';
          }
        }

        setCaption(computedCaption);
      } catch (err) {
        console.error("Mermaid parse failed for cleaned input:\n", safeChart);

        el.innerHTML = `
          <div style="padding:16px;font-family:monospace;color:#555">
            Diagram could not be rendered.
          </div>
        `;

        setCaption("");
      }
    };

    renderMermaid();
  }, [diagram]);

  return (
    <div className="w-full">
      {caption && (
        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
          <div className="text-sm font-semibold text-blue-900">{caption}</div>
          <div className="text-xs text-blue-700 mt-1">Diagram visualization</div>
        </div>
      )}
      <div 
        className="bg-white border border-gray-200 rounded-[20px] p-6 overflow-auto shadow-sm hover:shadow-md transition-shadow"
        style={{ 
          minHeight: '500px',
          maxHeight: '800px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div 
          ref={containerRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '100%',
            minHeight: '100%'
          }}
        />
      </div>
      <div className="mt-3 text-xs text-gray-500 italic">
        💡 Tip: You can scroll the diagram if it extends beyond the visible area
      </div>
    </div>
  );
};

export default Mermaidsetup;