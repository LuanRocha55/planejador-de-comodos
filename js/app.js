/* Multi-Room Architecture Planner — lógica do app (canvas, cômodos, móveis, camadas e exportação). */

const SVG_ICONS = {
  chevronDown: '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>',
  chevronRight: '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>',
  room: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>',
  door: '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v10M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>',
  window: '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm8-2v16M4 12h16"/></svg>',
  furniture: '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
  eye: '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>',
  eyeOff: '<svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>',
  lock: '<svg class="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>',
  lockOpen: '<svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/></svg>',
  trash: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>',
  rotate: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>'
};

// DEFAULT DATA (With user's real 4.0 x 3.0 bedroom & furniture)
const DEFAULT_ROOMS = [
  {
    id: 'room_quarto_solteiro',
    name: 'Quarto Solteiro',
    width: 4.0,
    height: 3.0,
    door: { wall: 'right', pos: 0.2, width: 0.8 },
    windows: [
      { id: 'w1', wall: 'left', pos: 0.8, width: 1.2 },
      { id: 'w2', wall: 'bottom', pos: 1.4, width: 1.2 }
    ],
    items: [
      { id: 'item_1', name: 'Guarda-Roupa', w: 2.0, h: 0.6, x: 0.2, y: 0.1, rotation: 0, color: '#10b981' },
      { id: 'item_2', name: 'Cama Solteiro', w: 0.9, h: 2.0, x: 0.2, y: 0.9, rotation: 0, color: '#3b82f6' },
      { id: 'item_3', name: 'Mesa Estudo', w: 1.5, h: 0.6, x: 1.6, y: 2.3, rotation: 0, color: '#f59e0b' },
      { id: 'item_4', name: 'Cômoda / Ventilador', w: 0.7, h: 0.45, x: 2.3, y: 0.1, rotation: 0, color: '#8b5cf6' },
      { id: 'item_5', name: 'Cadeira Escritório', w: 0.6, h: 0.6, x: 2.2, y: 1.6, rotation: 0, color: '#ec4899' },
      { id: 'item_6', name: 'Cadeira Extra', w: 0.55, h: 0.55, x: 3.2, y: 2.3, rotation: 0, color: '#06b6d4' },
      { id: 'item_7', name: 'Banco de Academia', w: 1.25, h: 0.45, x: 1.4, y: 1.0, rotation: 0, color: '#ef4444' }
    ]
  },
  {
    id: 'room_quarto_casal',
    name: 'Quarto Casal',
    width: 4.5,
    height: 3.5,
    door: { wall: 'bottom', pos: 0.3, width: 0.8 },
    windows: [
      { id: 'w_casal_1', wall: 'top', pos: 1.5, width: 1.6 }
    ],
    items: [
      { id: 'it_c1', name: 'Cama Queen', w: 1.6, h: 2.0, x: 1.45, y: 0.2, rotation: 0, color: '#2563eb' },
      { id: 'it_c2', name: 'Criado Esquerdo', w: 0.45, h: 0.45, x: 0.9, y: 0.2, rotation: 0, color: '#f59e0b' },
      { id: 'it_c3', name: 'Criado Direito', w: 0.45, h: 0.45, x: 3.15, y: 0.2, rotation: 0, color: '#f59e0b' },
      { id: 'it_c4', name: 'Guarda-Roupa Master', w: 2.6, h: 0.65, x: 0.2, y: 2.7, rotation: 0, color: '#10b981' }
    ]
  },
  {
    id: 'room_sala_estar',
    name: 'Sala de Estar',
    width: 5.0,
    height: 4.0,
    door: { wall: 'left', pos: 0.3, width: 0.9 },
    windows: [
      { id: 'w_sala_1', wall: 'right', pos: 1.2, width: 1.8 }
    ],
    items: [
      { id: 'it_s1', name: 'Sofá Retrátil', w: 2.4, h: 1.0, x: 1.3, y: 2.8, rotation: 0, color: '#475569' },
      { id: 'it_s2', name: 'Rack & TV', w: 2.0, h: 0.4, x: 1.5, y: 0.2, rotation: 0, color: '#0f172a' },
      { id: 'it_s3', name: 'Mesa de Centro', w: 0.9, h: 0.5, x: 2.05, y: 1.8, rotation: 0, color: '#d97706' }
    ]
  }
];

// APP STATE
let projectRooms = [];
let currentRoomId = 'room_quarto_solteiro';
let selectedType = null; // 'furniture' | 'door' | 'window' | 'room' | null
let selectedId = null;

// Expandable tree states per room
const treeRoomsState = {};
function getRoomTreeState(roomId) {
  if (!treeRoomsState[roomId]) {
    treeRoomsState[roomId] = {
      room: true,
      openings: true,
      furniture: true
    };
  }
  return treeRoomsState[roomId];
}

// Layer Master Visibility
const layers = {
  openings: true,
  furniture: true
};

// Dragging & Interaction
let isDragging = false;
let isResizing = false;
let isDraggingOpening = false;
let draggedOpening = null;

let dragStartX = 0;
let dragStartY = 0;
let itemStartX = 0;
let itemStartY = 0;
let itemStartW = 0;
let itemStartH = 0;

const canvas = document.getElementById('planCanvas');
const ctx = canvas.getContext('2d');
const WALL_THICKNESS = 0.15; // 15cm

// Toast Helper
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.remove('translate-y-20', 'opacity-0');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 2500);
}

function loadSavedProject() {
  try {
    const saved = localStorage.getItem('architecture_planner_rooms_v3');
    if (saved) {
      projectRooms = JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Erro ao carregar do localStorage', e);
  }
  if (!projectRooms || projectRooms.length === 0) {
    projectRooms = JSON.parse(JSON.stringify(DEFAULT_ROOMS));
  }
  if (!projectRooms.find(r => r.id === currentRoomId)) {
    currentRoomId = projectRooms[0].id;
  }
}

function saveProject() {
  try {
    localStorage.setItem('architecture_planner_rooms_v3', JSON.stringify(projectRooms));
  } catch (e) {
    console.warn('Erro ao salvar no localStorage', e);
  }
}

function getCurrentRoom() {
  const r = projectRooms.find(room => room.id === currentRoomId);
  return r || projectRooms[0];
}

function getItemBounds(item) {
  const isRotated = (item.rotation % 180 !== 0);
  const effW = isRotated ? item.h : item.w;
  const effH = isRotated ? item.w : item.h;
  return {
    effW,
    effH,
    x1: item.x,
    y1: item.y,
    x2: item.x + effW,
    y2: item.y + effH
  };
}

function checkCollisions() {
  const room = getCurrentRoom();
  let hasOverlap = false;

  // Reset collisions
  room.items.forEach(it => { it.collision = false; });

  // Compare pairs
  for (let i = 0; i < room.items.length; i++) {
    const itA = room.items[i];
    if (itA.visible === false) continue;
    const bA = getItemBounds(itA);

    for (let j = i + 1; j < room.items.length; j++) {
      const itB = room.items[j];
      if (itB.visible === false) continue;
      const bB = getItemBounds(itB);

      const overlap = !(bA.x2 <= bB.x1 || bA.x1 >= bB.x2 || bA.y2 <= bB.y1 || bA.y1 >= bB.y2);
      if (overlap) {
        itA.collision = true;
        itB.collision = true;
        hasOverlap = true;
      }
    }
  }

  // Update bottom indicator
  const collisionEl = document.getElementById('statusCollision');
  if (hasOverlap) {
    collisionEl.className = 'text-rose-600 font-bold flex items-center gap-1';
    collisionEl.innerHTML = `
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
      Colisão Detectada
    `;
  } else {
    collisionEl.className = 'text-emerald-600 font-medium flex items-center gap-1';
    collisionEl.innerHTML = `
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
      Layout Livre
    `;
  }
}

let scale = 100;
let originX = 50;
let originY = 50;

function resizeCanvas() {
  const room = getCurrentRoom();
  const wrapper = document.getElementById('canvasInner');
  if (!room || !wrapper) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = wrapper.getBoundingClientRect();
  const w = Math.floor(rect.width);
  const h = Math.floor(rect.height);

  if (w < 40 || h < 40) return;

  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';

  const padding = 70;
  const availW = Math.max(10, w - padding * 2);
  const availH = Math.max(10, h - padding * 2);

  const totalMetersX = room.width + (WALL_THICKNESS * 2);
  const totalMetersY = room.height + (WALL_THICKNESS * 2);

  scale = Math.max(15, Math.min(availW / totalMetersX, availH / totalMetersY));
  originX = (w - (room.width * scale)) / 2;
  originY = (h - (room.height * scale)) / 2;
}

function worldToScreen(wx, wy) {
  return {
    x: originX + (wx * scale),
    y: originY + (wy * scale)
  };
}

function screenToWorld(sx, sy) {
  return {
    x: (sx - originX) / scale,
    y: (sy - originY) / scale
  };
}

function drawRoom() {
  const room = getCurrentRoom();
  const spOrigin = worldToScreen(0, 0);
  const roomWpx = room.width * scale;
  const roomHpx = room.height * scale;

  // 1. Room Floor background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(spOrigin.x, spOrigin.y, roomWpx, roomHpx);

  // 2. Blueprint Architectural Grid (0.5m interval)
  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0.5; x < room.width; x += 0.5) {
    const p1 = worldToScreen(x, 0);
    const p2 = worldToScreen(x, room.height);
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
  }
  for (let y = 0.5; y < room.height; y += 0.5) {
    const p1 = worldToScreen(0, y);
    const p2 = worldToScreen(room.width, y);
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
  }
  ctx.stroke();

  // 3. Thick Room Walls
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = WALL_THICKNESS * scale;
  ctx.lineJoin = 'miter';
  ctx.strokeRect(spOrigin.x, spOrigin.y, roomWpx, roomHpx);

  if (!layers.openings) return;

  // 4. DRAW DOOR (Synchronized cutout & swing arc on any wall)
  if (room.door && room.door.visible !== false) {
    const d = room.door;
    const dw = d.width || 0.8;
    const dPos = d.pos !== undefined ? d.pos : 0.2;
    const isDoorSelected = (selectedType === 'door');

    let cutStartX = 0, cutStartY = 0, cutEndX = 0, cutEndY = 0;
    let hingeX = 0, hingeY = 0, leafEndX = 0, leafEndY = 0;
    let startAngle = 0, endAngle = 0;

    if (d.wall === 'right') {
      cutStartX = room.width; cutStartY = dPos;
      cutEndX = room.width; cutEndY = dPos + dw;
      hingeX = room.width; hingeY = dPos;
      leafEndX = room.width - dw; leafEndY = dPos;
      startAngle = Math.PI; endAngle = 0.5 * Math.PI;
    } else if (d.wall === 'bottom') {
      cutStartX = dPos; cutStartY = room.height;
      cutEndX = dPos + dw; cutEndY = room.height;
      hingeX = dPos; hingeY = room.height;
      leafEndX = dPos; leafEndY = room.height - dw;
      startAngle = 1.5 * Math.PI; endAngle = 0;
    } else if (d.wall === 'top') {
      cutStartX = dPos; cutStartY = 0;
      cutEndX = dPos + dw; cutEndY = 0;
      hingeX = dPos; hingeY = 0;
      leafEndX = dPos; leafEndY = dw;
      startAngle = 0.5 * Math.PI; endAngle = 0;
    } else if (d.wall === 'left') {
      cutStartX = 0; cutStartY = dPos;
      cutEndX = 0; cutEndY = dPos + dw;
      hingeX = 0; hingeY = dPos;
      leafEndX = dw; leafEndY = dPos;
      startAngle = 0; endAngle = 0.5 * Math.PI;
    }

    const spCutStart = worldToScreen(cutStartX, cutStartY);
    const spCutEnd = worldToScreen(cutEndX, cutEndY);
    const spHinge = worldToScreen(hingeX, hingeY);
    const spLeafEnd = worldToScreen(leafEndX, leafEndY);
    const rPx = dw * scale;

    // Cutout in thick wall
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = (WALL_THICKNESS * scale) + 4;
    ctx.beginPath();
    ctx.moveTo(spCutStart.x, spCutStart.y);
    ctx.lineTo(spCutEnd.x, spCutEnd.y);
    ctx.stroke();

    ctx.save();

    // Swing Area
    ctx.fillStyle = isDoorSelected ? 'rgba(168, 85, 247, 0.15)' : 'rgba(79, 70, 229, 0.06)';
    ctx.beginPath();
    ctx.moveTo(spHinge.x, spHinge.y);
    ctx.arc(spHinge.x, spHinge.y, rPx, startAngle, endAngle, (d.wall === 'right' || d.wall === 'bottom'));
    ctx.closePath();
    ctx.fill();

    // Swing dashed arc
    ctx.strokeStyle = isDoorSelected ? '#7c3aed' : '#818cf8';
    ctx.lineWidth = isDoorSelected ? 2.5 : 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(spHinge.x, spHinge.y, rPx, startAngle, endAngle, (d.wall === 'right' || d.wall === 'bottom'));
    ctx.stroke();
    ctx.setLineDash([]);

    // Door leaf
    ctx.strokeStyle = isDoorSelected ? '#7c3aed' : '#4f46e5';
    ctx.lineWidth = isDoorSelected ? 4 : 3;
    ctx.beginPath();
    ctx.moveTo(spHinge.x, spHinge.y);
    ctx.lineTo(spLeafEnd.x, spLeafEnd.y);
    ctx.stroke();

    // Drag handle node when door is selected
    if (isDoorSelected) {
      const spMid = worldToScreen((cutStartX + cutEndX) / 2, (cutStartY + cutEndY) / 2);
      ctx.fillStyle = '#7c3aed';
      ctx.beginPath();
      ctx.arc(spMid.x, spMid.y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.restore();
  }

  // 5. DRAW WINDOWS
  if (room.windows && room.windows.length > 0) {
    room.windows.forEach(w => {
      if (w.visible === false) return;
      const ww = w.width || 1.2;
      const wPos = w.pos !== undefined ? w.pos : 0.5;
      const isWinSelected = (selectedType === 'window' && selectedId === w.id);

      let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
      if (w.wall === 'bottom') { x1 = wPos; y1 = room.height; x2 = wPos + ww; y2 = room.height; }
      else if (w.wall === 'top') { x1 = wPos; y1 = 0; x2 = wPos + ww; y2 = 0; }
      else if (w.wall === 'left') { x1 = 0; y1 = wPos; x2 = 0; y2 = wPos + ww; }
      else if (w.wall === 'right') { x1 = room.width; y1 = wPos; x2 = room.width; y2 = wPos + ww; }

      const sp1 = worldToScreen(x1, y1);
      const sp2 = worldToScreen(x2, y2);

      // Wall cutout
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = (WALL_THICKNESS * scale) + 4;
      ctx.beginPath();
      ctx.moveTo(sp1.x, sp1.y);
      ctx.lineTo(sp2.x, sp2.y);
      ctx.stroke();

      // Glazing frame line
      ctx.strokeStyle = isWinSelected ? '#7c3aed' : '#0284c7';
      ctx.lineWidth = isWinSelected ? 4 : 3;
      ctx.beginPath();
      ctx.moveTo(sp1.x, sp1.y);
      ctx.lineTo(sp2.x, sp2.y);
      ctx.stroke();

      // Drag handle node when window is selected
      if (isWinSelected) {
        const spMid = worldToScreen((x1 + x2) / 2, (y1 + y2) / 2);
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(spMid.x, spMid.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  }
}

function drawFurniture(item) {
  if (!layers.furniture || item.visible === false) return;

  const isSelected = (selectedType === 'furniture' && selectedId === item.id);
  const isRotated = (item.rotation % 180 !== 0);
  const b = getItemBounds(item);

  const spCorner = worldToScreen(item.x, item.y);
  const wPx = b.effW * scale;
  const hPx = b.effH * scale;

  ctx.save();

  // Shadow
  ctx.shadowColor = isSelected ? 'rgba(124, 58, 237, 0.3)' : 'rgba(0, 0, 0, 0.08)';
  ctx.shadowBlur = isSelected ? 12 : 6;
  ctx.shadowOffsetY = isSelected ? 4 : 2;

  // Main Fill Body
  ctx.fillStyle = item.collision ? '#fee2e2' : (item.color || '#3b82f6') + '22';
  ctx.fillRect(spCorner.x, spCorner.y, wPx, hPx);

  // Stroke Outline
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = item.collision ? '#ef4444' : (isSelected ? '#7c3aed' : (item.color || '#3b82f6'));
  ctx.lineWidth = isSelected ? 3 : 2;
  ctx.strokeRect(spCorner.x, spCorner.y, wPx, hPx);

  // Orientation Marker (Directional Notch / Backrest indicator)
  ctx.fillStyle = isSelected ? '#7c3aed' : (item.color || '#3b82f6');
  const notchH = Math.min(6, hPx * 0.15);
  ctx.fillRect(spCorner.x, spCorner.y, wPx, notchH);

  // Furniture Name & Dimensions (always horizontal and legible)
  ctx.fillStyle = isSelected ? '#581c87' : '#1e293b';
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const centerX = spCorner.x + (wPx / 2);
  const centerY = spCorner.y + (hPx / 2);

  if (hPx >= 30 && wPx >= 35) {
    ctx.fillText(item.name, centerX, centerY - (hPx > 45 ? 6 : 0));
    if (hPx > 45) {
      ctx.fillStyle = '#64748b';
      ctx.font = '500 10px "JetBrains Mono", monospace';
      ctx.fillText(`${b.effW.toFixed(2)}×${b.effH.toFixed(2)}m`, centerX, centerY + 8);
    }
  }

  // Corner Resize Handle for selected item
  if (isSelected && !item.locked) {
    const resizeHandleX = spCorner.x + wPx;
    const resizeHandleY = spCorner.y + hPx;

    ctx.fillStyle = '#7c3aed';
    ctx.beginPath();
    ctx.arc(resizeHandleX, resizeHandleY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  ctx.restore();
}

function getPointerWorldPos(e) {
  const rect = canvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return screenToWorld(clientX - rect.left, clientY - rect.top);
}

function distToSegment(px, py, x1, y1, x2, y2) {
  const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
}

function hitTestOpenings(worldPos) {
  if (!layers.openings) return null;
  const room = getCurrentRoom();

  // Door Test
  if (room.door && room.door.visible !== false) {
    const d = room.door;
    const dw = d.width || 0.8;
    const dPos = d.pos !== undefined ? d.pos : 0.2;
    let cX1 = 0, cY1 = 0, cX2 = 0, cY2 = 0, hX = 0, hY = 0;

    if (d.wall === 'right') {
      hX = room.width; hY = dPos;
      cX1 = room.width; cY1 = dPos; cX2 = room.width; cY2 = dPos + dw;
    } else if (d.wall === 'bottom') {
      hX = dPos; hY = room.height;
      cX1 = dPos; cY1 = room.height; cX2 = dPos + dw; cY2 = room.height;
    } else if (d.wall === 'top') {
      hX = dPos; hY = 0;
      cX1 = dPos; cY1 = 0; cX2 = dPos + dw; cY2 = 0;
    } else if (d.wall === 'left') {
      hX = 0; hY = dPos;
      cX1 = 0; cY1 = dPos; cX2 = 0; cY2 = dPos + dw;
    }

    const distCut = distToSegment(worldPos.x, worldPos.y, cX1, cY1, cX2, cY2);
    const distHinge = Math.hypot(worldPos.x - hX, worldPos.y - hY);

    if (distCut <= 0.35 || distHinge <= dw + 0.15) {
      const currentAxisCoord = (d.wall === 'top' || d.wall === 'bottom') ? worldPos.x : worldPos.y;
      return {
        type: 'door',
        id: 'door',
        target: d,
        offset: currentAxisCoord - dPos
      };
    }
  }

  // Windows Test
  if (room.windows && room.windows.length > 0) {
    for (let i = room.windows.length - 1; i >= 0; i--) {
      const w = room.windows[i];
      if (w.visible === false) continue;
      const ww = w.width || 1.2;
      const wPos = w.pos !== undefined ? w.pos : 0.5;
      let x1 = 0, y1 = 0, x2 = 0, y2 = 0;

      if (w.wall === 'bottom') { x1 = wPos; y1 = room.height; x2 = wPos + ww; y2 = room.height; }
      else if (w.wall === 'top') { x1 = wPos; y1 = 0; x2 = wPos + ww; y2 = 0; }
      else if (w.wall === 'left') { x1 = 0; y1 = wPos; x2 = 0; y2 = wPos + ww; }
      else if (w.wall === 'right') { x1 = room.width; y1 = wPos; x2 = room.width; y2 = wPos + ww; }

      if (distToSegment(worldPos.x, worldPos.y, x1, y1, x2, y2) <= 0.35) {
        const currentAxisCoord = (w.wall === 'top' || w.wall === 'bottom') ? worldPos.x : worldPos.y;
        return {
          type: 'window',
          id: w.id,
          target: w,
          offset: currentAxisCoord - wPos
        };
      }
    }
  }

  return null;
}

function hitTestResizeHandle(worldPos) {
  if (selectedType !== 'furniture' || !selectedId) return false;
  const room = getCurrentRoom();
  const item = room.items.find(it => it.id === selectedId);
  if (!item || item.locked || item.visible === false) return false;

  const b = getItemBounds(item);
  const cornerX = item.x + b.effW;
  const cornerY = item.y + b.effH;
  const dist = Math.hypot(worldPos.x - cornerX, worldPos.y - cornerY);
  return dist <= 0.28;
}

function hitTestFurniture(worldPos) {
  if (!layers.furniture) return null;
  const room = getCurrentRoom();
  for (let i = room.items.length - 1; i >= 0; i--) {
    const item = room.items[i];
    if (item.visible === false || item.locked) continue;
    const b = getItemBounds(item);
    if (worldPos.x >= b.x1 && worldPos.x <= b.x2 && worldPos.y >= b.y1 && worldPos.y <= b.y2) {
      return item;
    }
  }
  return null;
}

// Pointer Event Listeners
canvas.addEventListener('mousedown', onPointerDown);
canvas.addEventListener('touchstart', onPointerDown, { passive: false });
window.addEventListener('mousemove', onPointerMove);
window.addEventListener('touchmove', onPointerMove, { passive: false });
window.addEventListener('mouseup', onPointerUp);
window.addEventListener('touchend', onPointerUp);

function onPointerDown(e) {
  const worldPos = getPointerWorldPos(e);

  // 1. Resize Handle
  if (hitTestResizeHandle(worldPos)) {
    isResizing = true;
    const room = getCurrentRoom();
    const item = room.items.find(it => it.id === selectedId);
    itemStartW = item.w;
    itemStartH = item.h;
    dragStartX = worldPos.x;
    dragStartY = worldPos.y;
    e.preventDefault();
    return;
  }

  // 2. Openings (Doors / Windows)
  const openingHit = hitTestOpenings(worldPos);
  if (openingHit) {
    selectedType = openingHit.type;
    selectedId = openingHit.id;
    isDraggingOpening = true;
    draggedOpening = openingHit;
    updateUI();
    e.preventDefault();
    return;
  }

  // 3. Furniture
  const hit = hitTestFurniture(worldPos);
  if (hit) {
    selectedType = 'furniture';
    selectedId = hit.id;
    isDragging = true;
    dragStartX = worldPos.x;
    dragStartY = worldPos.y;
    itemStartX = hit.x;
    itemStartY = hit.y;
    updateUI();
    e.preventDefault();
    return;
  }

  // 4. Clicked on floor space -> Select current room
  selectedType = 'room';
  selectedId = currentRoomId;
  updateUI();
}

function onPointerMove(e) {
  const worldPos = getPointerWorldPos(e);
  const room = getCurrentRoom();

  // Free Movement for Door & Windows across walls
  if (isDraggingOpening && draggedOpening) {
    const item = draggedOpening.target;
    const openingWidth = item.width || 0.8;

    // Distances to each of the 4 walls
    const distTop = Math.abs(worldPos.y);
    const distBottom = Math.abs(worldPos.y - room.height);
    const distLeft = Math.abs(worldPos.x);
    const distRight = Math.abs(worldPos.x - room.width);

    const minDist = Math.min(distTop, distBottom, distLeft, distRight);
    let targetWall = item.wall;

    if (minDist === distTop) targetWall = 'top';
    else if (minDist === distBottom) targetWall = 'bottom';
    else if (minDist === distLeft) targetWall = 'left';
    else if (minDist === distRight) targetWall = 'right';

    item.wall = targetWall;

    let rawPos = 0;
    let maxPos = 0;

    if (targetWall === 'top' || targetWall === 'bottom') {
      maxPos = Math.max(0.1, room.width - openingWidth);
      rawPos = worldPos.x - (openingWidth / 2);
    } else {
      maxPos = Math.max(0.1, room.height - openingWidth);
      rawPos = worldPos.y - (openingWidth / 2);
    }

    const clamped = Math.max(0.05, Math.min(maxPos, rawPos));
    item.pos = Math.round(clamped * 20) / 20; // 5cm snap

    checkCollisions();
    syncInspectorValues();
    document.getElementById('statusCoords').textContent = `${draggedOpening.type === 'door' ? 'Porta' : 'Janela'} na parede ${item.wall} • Posição: ${item.pos.toFixed(2)}m`;
    if (e.cancelable) e.preventDefault();
    return;
  }

  // Resizing Furniture
  if (isResizing && selectedType === 'furniture' && selectedId) {
    const item = room.items.find(it => it.id === selectedId);
    if (item) {
      const dx = worldPos.x - dragStartX;
      const dy = worldPos.y - dragStartY;
      const isRotated = (item.rotation % 180 !== 0);

      if (isRotated) {
        item.h = Math.max(0.3, Math.min(6.0, itemStartH + dx));
        item.w = Math.max(0.3, Math.min(6.0, itemStartW + dy));
      } else {
        item.w = Math.max(0.3, Math.min(6.0, itemStartW + dx));
        item.h = Math.max(0.3, Math.min(6.0, itemStartH + dy));
      }
      checkCollisions();
      syncInspectorValues();
    }
    if (e.cancelable) e.preventDefault();
    return;
  }

  // Dragging Furniture
  if (isDragging && selectedType === 'furniture' && selectedId) {
    const item = room.items.find(it => it.id === selectedId);
    if (item) {
      const dx = worldPos.x - dragStartX;
      const dy = worldPos.y - dragStartY;
      const b = getItemBounds(item);

      let newX = itemStartX + dx;
      let newY = itemStartY + dy;

      // Wall magnetic snap (5cm)
      if (newX < 0.05) newX = 0;
      if (newY < 0.05) newY = 0;
      if (newX + b.effW > room.width - 0.05) newX = room.width - b.effW;
      if (newY + b.effH > room.height - 0.05) newY = room.height - b.effH;

      item.x = Math.round(newX * 40) / 40; // 2.5cm step
      item.y = Math.round(newY * 40) / 40;

      checkCollisions();
      document.getElementById('statusCoords').textContent = `X: ${item.x.toFixed(2)}m • Y: ${item.y.toFixed(2)}m`;
    }
    if (e.cancelable) e.preventDefault();
  }
}

function onPointerUp() {
  if (isDragging || isResizing || isDraggingOpening) {
    saveProject();
  }
  isDragging = false;
  isResizing = false;
  isDraggingOpening = false;
  draggedOpening = null;
}

function rotateSelectedItem() {
  if (selectedType !== 'furniture' || !selectedId) return;
  const room = getCurrentRoom();
  const item = room.items.find(it => it.id === selectedId);
  if (!item) return;

  item.rotation = (item.rotation + 90) % 360;

  // Keep inside bounds
  const b = getItemBounds(item);
  if (item.x + b.effW > room.width) item.x = Math.max(0, room.width - b.effW);
  if (item.y + b.effH > room.height) item.y = Math.max(0, room.height - b.effH);

  checkCollisions();
  saveProject();
  renderLayersTree();
  updateUI();
  showToast(`'${item.name}' girado para ${item.rotation}°`);
}

function renderLayersTree() {
  const treeContainer = document.getElementById('layersTreeRoot');
  treeContainer.innerHTML = '';

  document.getElementById('treeStatsBadge').textContent = `${projectRooms.length} Cômodo${projectRooms.length > 1 ? 's' : ''}`;

  projectRooms.forEach((room) => {
    const roomState = getRoomTreeState(room.id);
    const isActiveRoom = (room.id === currentRoomId);
    const isRoomSelected = (selectedType === 'room' && selectedId === room.id && isActiveRoom);

    // --- ROOM NODE ---
    const roomNode = document.createElement('div');
    roomNode.className = `rounded-2xl overflow-hidden border transition ${
      isActiveRoom ? 'border-purple-200 bg-purple-50/20' : 'border-slate-100 bg-white'
    }`;

    const roomHeader = document.createElement('div');
    roomHeader.className = `flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition ${
      isRoomSelected 
        ? 'bg-purple-100 text-purple-900 font-bold' 
        : isActiveRoom
        ? 'bg-purple-50/80 hover:bg-purple-100/60 text-slate-800'
        : 'hover:bg-slate-50 text-slate-700'
    }`;

    roomHeader.innerHTML = `
      <div class="flex items-center gap-2 min-w-0 flex-1">
        <button class="btn-toggle-room p-1 text-slate-400 hover:text-purple-700 rounded transition shrink-0">
          ${roomState.room ? SVG_ICONS.chevronDown : SVG_ICONS.chevronRight}
        </button>
        <span class="${isActiveRoom ? 'text-purple-700' : 'text-slate-400'} shrink-0">${SVG_ICONS.room}</span>
        <span class="text-xs font-bold truncate ${isActiveRoom ? 'text-purple-950' : 'text-slate-700'}">${room.name}</span>
        <span class="text-[10px] text-slate-400 font-mono">(${room.width.toFixed(1)}×${room.height.toFixed(1)}m)</span>
      </div>
      <div class="flex items-center gap-1 shrink-0">
        ${isActiveRoom ? '<span class="text-[9px] bg-purple-700 text-white font-bold px-2 py-0.5 rounded-full">Ativo</span>' : ''}
      </div>
    `;

    roomHeader.querySelector('.btn-toggle-room').addEventListener('click', (e) => {
      e.stopPropagation();
      roomState.room = !roomState.room;
      renderLayersTree();
    });

    roomHeader.addEventListener('click', () => {
      if (currentRoomId !== room.id) {
        currentRoomId = room.id;
        selectedType = 'room';
        selectedId = room.id;
        resizeCanvas();
        updateUI();
      } else {
        selectedType = 'room';
        selectedId = room.id;
        updateUI();
      }
    });

    roomNode.appendChild(roomHeader);

    // CHILDREN
    if (roomState.room) {
      const roomChildren = document.createElement('div');
      roomChildren.className = 'pl-3.5 pr-2 py-1.5 space-y-1.5 border-l-2 border-purple-100 ml-4 my-1.5';

      // --- OPENINGS FOLDER ---
      const openingsCount = (room.door ? 1 : 0) + (room.windows ? room.windows.length : 0);
      const openingsNode = document.createElement('div');
      openingsNode.className = 'rounded-xl';

      const openingsHeader = document.createElement('div');
      openingsHeader.className = 'flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-100/60 text-slate-700 cursor-pointer transition';
      openingsHeader.innerHTML = `
        <div class="flex items-center gap-1.5 min-w-0">
          <button class="btn-toggle-openings p-0.5 text-slate-400 hover:text-purple-700 rounded transition shrink-0">
            ${roomState.openings ? SVG_ICONS.chevronDown : SVG_ICONS.chevronRight}
          </button>
          <span class="text-indigo-600 shrink-0">${SVG_ICONS.door}</span>
          <span class="text-[11px] font-bold text-slate-700">Portas & Janelas</span>
          <span class="text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-full">${openingsCount}</span>
        </div>
        ${isActiveRoom ? `
          <button class="btn-eye-openings p-1 text-slate-400 hover:text-purple-700 rounded transition shrink-0" title="Exibir/Ocultar Camada">
            ${layers.openings ? SVG_ICONS.eye : SVG_ICONS.eyeOff}
          </button>
        ` : ''}
      `;

      openingsHeader.querySelector('.btn-toggle-openings').addEventListener('click', (e) => {
        e.stopPropagation();
        roomState.openings = !roomState.openings;
        renderLayersTree();
      });

      const eyeOpeningsBtn = openingsHeader.querySelector('.btn-eye-openings');
      if (eyeOpeningsBtn) {
        eyeOpeningsBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          layers.openings = !layers.openings;
          if (!layers.openings && (selectedType === 'door' || selectedType === 'window')) {
            selectedType = null;
            selectedId = null;
          }
          renderLayersTree();
          updateUI();
          showToast(`Portas & Janelas: ${layers.openings ? 'Visíveis' : 'Ocultadas'}`);
        });
      }

      openingsNode.appendChild(openingsHeader);

      if (roomState.openings) {
        const openingsList = document.createElement('div');
        openingsList.className = 'pl-4 space-y-1 border-l border-slate-100 ml-2.5 my-1';

        // Door leaf
        if (room.door) {
          const isDoorSel = (isActiveRoom && selectedType === 'door');
          const doorItem = document.createElement('div');
          doorItem.className = `flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition text-xs ${
            isDoorSel ? 'bg-purple-100 text-purple-900 font-bold' : 'hover:bg-slate-100/60 text-slate-700'
          }`;

          doorItem.innerHTML = `
            <div class="flex items-center gap-1.5 min-w-0">
              <span class="text-purple-600 shrink-0">${SVG_ICONS.door}</span>
              <span class="truncate">Porta de Entrada</span>
              <span class="text-[10px] text-slate-400 font-mono">(${room.door.width || 0.8}m • ${room.door.wall})</span>
            </div>
          `;

          doorItem.addEventListener('click', () => {
            if (currentRoomId !== room.id) {
              currentRoomId = room.id;
              resizeCanvas();
            }
            selectedType = 'door';
            selectedId = 'door';
            updateUI();
          });

          openingsList.appendChild(doorItem);
        }

        // Window leaves
        if (room.windows) {
          room.windows.forEach((win, index) => {
            const isWinSel = (isActiveRoom && selectedType === 'window' && selectedId === win.id);
            const winItem = document.createElement('div');
            winItem.className = `flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition text-xs ${
              isWinSel ? 'bg-purple-100 text-purple-900 font-bold' : 'hover:bg-slate-100/60 text-slate-700'
            }`;

            winItem.innerHTML = `
              <div class="flex items-center gap-1.5 min-w-0">
                <span class="text-sky-500 shrink-0">${SVG_ICONS.window}</span>
                <span class="truncate">Janela ${index + 1}</span>
                <span class="text-[10px] text-slate-400 font-mono">(${win.width || 1.2}m • ${win.wall})</span>
              </div>
            `;

            winItem.addEventListener('click', () => {
              if (currentRoomId !== room.id) {
                currentRoomId = room.id;
                resizeCanvas();
              }
              selectedType = 'window';
              selectedId = win.id;
              updateUI();
            });

            openingsList.appendChild(winItem);
          });
        }

        openingsNode.appendChild(openingsList);
      }

      roomChildren.appendChild(openingsNode);

      // --- FURNITURE FOLDER ---
      const furnitureNode = document.createElement('div');
      furnitureNode.className = 'rounded-xl';

      const furnitureHeader = document.createElement('div');
      furnitureHeader.className = 'flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-100/60 text-slate-700 cursor-pointer transition';
      furnitureHeader.innerHTML = `
        <div class="flex items-center gap-1.5 min-w-0">
          <button class="btn-toggle-furniture p-0.5 text-slate-400 hover:text-purple-700 rounded transition shrink-0">
            ${roomState.furniture ? SVG_ICONS.chevronDown : SVG_ICONS.chevronRight}
          </button>
          <span class="text-purple-600 shrink-0">${SVG_ICONS.furniture}</span>
          <span class="text-[11px] font-bold text-slate-700">Móveis</span>
          <span class="text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-full">${room.items.length}</span>
        </div>
        ${isActiveRoom ? `
          <button class="btn-eye-furniture p-1 text-slate-400 hover:text-purple-700 rounded transition shrink-0" title="Exibir/Ocultar Camada">
            ${layers.furniture ? SVG_ICONS.eye : SVG_ICONS.eyeOff}
          </button>
        ` : ''}
      `;

      furnitureHeader.querySelector('.btn-toggle-furniture').addEventListener('click', (e) => {
        e.stopPropagation();
        roomState.furniture = !roomState.furniture;
        renderLayersTree();
      });

      const eyeFurnBtn = furnitureHeader.querySelector('.btn-eye-furniture');
      if (eyeFurnBtn) {
        eyeFurnBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          layers.furniture = !layers.furniture;
          if (!layers.furniture && selectedType === 'furniture') {
            selectedType = null;
            selectedId = null;
          }
          checkCollisions();
          renderLayersTree();
          updateUI();
          showToast(`Móveis: ${layers.furniture ? 'Visíveis' : 'Ocultados'}`);
        });
      }

      furnitureNode.appendChild(furnitureHeader);

      if (roomState.furniture) {
        const furnitureList = document.createElement('div');
        furnitureList.className = 'pl-4 space-y-1 border-l border-slate-100 ml-2.5 my-1';

        if (room.items.length === 0) {
          furnitureList.innerHTML = '<div class="text-[11px] text-slate-400 py-1 pl-1">Nenhum móvel cadastrado</div>';
        } else {
          room.items.forEach(it => {
            const isFurnSel = (isActiveRoom && selectedType === 'furniture' && selectedId === it.id);
            const b = getItemBounds(it);

            const furnItem = document.createElement('div');
            furnItem.className = `flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition text-xs ${
              isFurnSel ? 'bg-purple-100 text-purple-900 font-bold' : 'hover:bg-slate-100/60 text-slate-700'
            } ${it.visible === false ? 'opacity-40' : ''}`;

            furnItem.innerHTML = `
              <div class="flex items-center gap-1.5 min-w-0 mr-1">
                <span class="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-slate-200" style="background-color: ${it.color}"></span>
                <span class="truncate">${it.name}</span>
                <span class="text-[10px] text-slate-400 font-mono shrink-0">${b.effW.toFixed(1)}×${b.effH.toFixed(1)}m</span>
              </div>
              <div class="flex items-center gap-0.5 shrink-0">
                <button class="btn-item-lock p-1 text-slate-400 hover:text-slate-700 rounded transition" title="${it.locked ? 'Desbloquear' : 'Travar'}">
                  ${it.locked ? SVG_ICONS.lock : SVG_ICONS.lockOpen}
                </button>
                <button class="btn-item-eye p-1 text-slate-400 hover:text-purple-700 rounded transition" title="${it.visible !== false ? 'Ocultar' : 'Exibir'}">
                  ${it.visible !== false ? SVG_ICONS.eye : SVG_ICONS.eyeOff}
                </button>
              </div>
            `;

            furnItem.addEventListener('click', (e) => {
              if (e.target.closest('button')) return;
              if (currentRoomId !== room.id) {
                currentRoomId = room.id;
                resizeCanvas();
              }
              selectedType = 'furniture';
              selectedId = it.id;
              updateUI();
            });

            furnItem.querySelector('.btn-item-lock').addEventListener('click', (e) => {
              e.stopPropagation();
              it.locked = !it.locked;
              saveProject();
              renderLayersTree();
              updateUI();
              showToast(`'${it.name}': ${it.locked ? 'Travado' : 'Desbloqueado'}`);
            });

            furnItem.querySelector('.btn-item-eye').addEventListener('click', (e) => {
              e.stopPropagation();
              it.visible = (it.visible === false);
              checkCollisions();
              saveProject();
              renderLayersTree();
              updateUI();
            });

            furnitureList.appendChild(furnItem);
          });
        }

        furnitureNode.appendChild(furnitureList);
      }

      roomChildren.appendChild(furnitureNode);
      roomNode.appendChild(roomChildren);
    }

    treeContainer.appendChild(roomNode);
  });
}

function renderInspector() {
  const container = document.getElementById('inspectorContainer');
  const room = getCurrentRoom();

  // CASE 1: FURNITURE SELECTED
  if (selectedType === 'furniture' && selectedId) {
    const item = room.items.find(it => it.id === selectedId);
    if (!item) {
      selectedType = null;
      selectedId = null;
      renderInspector();
      return;
    }

    container.innerHTML = `
      <div class="space-y-3">
        <div class="flex items-center justify-between pb-1 border-b border-slate-200">
          <span class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-full" style="background-color: ${item.color}"></span>
            Editar Móvel
          </span>
          <button id="btnDeleteSelectedFurn" class="text-rose-600 hover:text-rose-700 p-1 rounded-lg transition" title="Excluir Móvel">
            ${SVG_ICONS.trash}
          </button>
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-slate-600 mb-1">Nome</label>
          <input type="text" id="editFurnName" value="${item.name}" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600">
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-[11px] font-semibold text-slate-600 mb-1">Largura (m)</label>
            <input type="number" id="editFurnW" step="0.05" min="0.2" max="6.0" value="${item.w.toFixed(2)}" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-600">
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-slate-600 mb-1">Comprimento (m)</label>
            <input type="number" id="editFurnH" step="0.05" min="0.2" max="6.0" value="${item.h.toFixed(2)}" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-600">
          </div>
        </div>

        <div class="flex items-center justify-between pt-1">
          <div class="flex items-center gap-1.5">
            <input type="color" id="editFurnColor" value="${item.color}" class="w-7 h-7 rounded-lg cursor-pointer border-0 p-0">
            <span class="text-[11px] text-slate-500 font-medium">Cor</span>
          </div>
          <button id="btnRotateFurnInspector" class="bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1.5">
            ${SVG_ICONS.rotate}
            <span>Girar 90°</span>
          </button>
        </div>
      </div>
    `;

    document.getElementById('editFurnName').addEventListener('input', (e) => {
      item.name = e.target.value;
      saveProject();
      renderLayersTree();
    });

    document.getElementById('editFurnW').addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (!isNaN(val) && val >= 0.2) {
        item.w = val;
        checkCollisions();
        saveProject();
        renderLayersTree();
      }
    });

    document.getElementById('editFurnH').addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (!isNaN(val) && val >= 0.2) {
        item.h = val;
        checkCollisions();
        saveProject();
        renderLayersTree();
      }
    });

    document.getElementById('editFurnColor').addEventListener('input', (e) => {
      item.color = e.target.value;
      saveProject();
      renderLayersTree();
    });

    document.getElementById('btnRotateFurnInspector').addEventListener('click', rotateSelectedItem);
    document.getElementById('btnDeleteSelectedFurn').addEventListener('click', () => {
      room.items = room.items.filter(it => it.id !== item.id);
      selectedType = null;
      selectedId = null;
      checkCollisions();
      saveProject();
      renderLayersTree();
      updateUI();
      showToast(`'${item.name}' excluído.`);
    });
    return;
  }

  // CASE 2: DOOR SELECTED
  if (selectedType === 'door') {
    const door = room.door;
    container.innerHTML = `
      <div class="space-y-3">
        <div class="flex items-center justify-between pb-1 border-b border-slate-200">
          <span class="text-xs font-bold text-slate-800 flex items-center gap-1.5 text-indigo-700">
            ${SVG_ICONS.door}
            Porta de Entrada
          </span>
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-slate-600 mb-1">Parede de Instalação</label>
          <select id="editDoorWall" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white">
            <option value="right" ${door.wall === 'right' ? 'selected' : ''}>Parede Direita</option>
            <option value="left" ${door.wall === 'left' ? 'selected' : ''}>Parede Esquerda</option>
            <option value="top" ${door.wall === 'top' ? 'selected' : ''}>Parede Superior (Cima)</option>
            <option value="bottom" ${door.wall === 'bottom' ? 'selected' : ''}>Parede Inferior (Baixo)</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-[11px] font-semibold text-slate-600 mb-1">Largura do Vão (m)</label>
            <input type="number" id="editDoorW" step="0.05" min="0.6" max="1.5" value="${(door.width || 0.8).toFixed(2)}" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-600">
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-slate-600 mb-1">Posição na Parede (m)</label>
            <input type="number" id="editDoorPos" step="0.05" min="0.05" max="10.0" value="${(door.pos || 0.2).toFixed(2)}" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-600">
          </div>
        </div>
        <p class="text-[10px] text-slate-400">Dica: Você também pode arrastar a porta diretamente no mapa.</p>
      </div>
    `;

    document.getElementById('editDoorWall').addEventListener('change', (e) => {
      door.wall = e.target.value;
      saveProject();
      renderLayersTree();
    });

    document.getElementById('editDoorW').addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (!isNaN(val) && val >= 0.4) {
        door.width = val;
        saveProject();
        renderLayersTree();
      }
    });

    document.getElementById('editDoorPos').addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (!isNaN(val) && val >= 0) {
        door.pos = val;
        saveProject();
        renderLayersTree();
      }
    });
    return;
  }

  // CASE 3: WINDOW SELECTED
  if (selectedType === 'window' && selectedId) {
    const win = room.windows.find(w => w.id === selectedId);
    if (!win) {
      selectedType = null;
      selectedId = null;
      renderInspector();
      return;
    }

    container.innerHTML = `
      <div class="space-y-3">
        <div class="flex items-center justify-between pb-1 border-b border-slate-200">
          <span class="text-xs font-bold text-slate-800 flex items-center gap-1.5 text-sky-600">
            ${SVG_ICONS.window}
            Editar Janela
          </span>
          <button id="btnDeleteSelectedWin" class="text-rose-600 hover:text-rose-700 p-1 rounded-lg transition" title="Excluir Janela">
            ${SVG_ICONS.trash}
          </button>
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-slate-600 mb-1">Parede de Instalação</label>
          <select id="editWinWall" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white">
            <option value="right" ${win.wall === 'right' ? 'selected' : ''}>Parede Direita</option>
            <option value="left" ${win.wall === 'left' ? 'selected' : ''}>Parede Esquerda</option>
            <option value="top" ${win.wall === 'top' ? 'selected' : ''}>Parede Superior (Cima)</option>
            <option value="bottom" ${win.wall === 'bottom' ? 'selected' : ''}>Parede Inferior (Baixo)</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-[11px] font-semibold text-slate-600 mb-1">Largura (m)</label>
            <input type="number" id="editWinW" step="0.05" min="0.4" max="3.0" value="${(win.width || 1.2).toFixed(2)}" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-600">
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-slate-600 mb-1">Posição na Parede (m)</label>
            <input type="number" id="editWinPos" step="0.05" min="0.05" max="10.0" value="${(win.pos || 0.5).toFixed(2)}" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-600">
          </div>
        </div>
        <p class="text-[10px] text-slate-400">Dica: Você também pode arrastar a janela diretamente no mapa.</p>
      </div>
    `;

    document.getElementById('editWinWall').addEventListener('change', (e) => {
      win.wall = e.target.value;
      saveProject();
      renderLayersTree();
    });

    document.getElementById('editWinW').addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (!isNaN(val) && val >= 0.3) {
        win.width = val;
        saveProject();
        renderLayersTree();
      }
    });

    document.getElementById('editWinPos').addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (!isNaN(val) && val >= 0) {
        win.pos = val;
        saveProject();
        renderLayersTree();
      }
    });

    document.getElementById('btnDeleteSelectedWin').addEventListener('click', () => {
      room.windows = room.windows.filter(w => w.id !== win.id);
      selectedType = null;
      selectedId = null;
      saveProject();
      renderLayersTree();
      updateUI();
      showToast('Janela excluída.');
    });
    return;
  }

  // CASE 4: ROOM SELECTED
  if (selectedType === 'room') {
    container.innerHTML = `
      <div class="space-y-3">
        <div class="flex items-center justify-between pb-1 border-b border-slate-200">
          <span class="text-xs font-bold text-slate-800 flex items-center gap-1.5 text-purple-700">
            ${SVG_ICONS.room}
            Dimensões do Cômodo
          </span>
          ${projectRooms.length > 1 ? `
            <button id="btnDeleteRoom" class="text-rose-600 hover:text-rose-700 p-1 rounded-lg transition" title="Excluir Cômodo">
              ${SVG_ICONS.trash}
            </button>
          ` : ''}
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-slate-600 mb-1">Nome do Cômodo</label>
          <input type="text" id="editRoomName" value="${room.name}" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600">
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-[11px] font-semibold text-slate-600 mb-1">Largura X (m)</label>
            <input type="number" id="editRoomW" step="0.1" min="2.0" max="15.0" value="${room.width.toFixed(2)}" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-600">
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-slate-600 mb-1">Comprimento Y (m)</label>
            <input type="number" id="editRoomH" step="0.1" min="2.0" max="15.0" value="${room.height.toFixed(2)}" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-600">
          </div>
        </div>
      </div>
    `;

    document.getElementById('editRoomName').addEventListener('input', (e) => {
      room.name = e.target.value;
      saveProject();
      renderLayersTree();
      renderRoomPills();
      updateTopSummary();
    });

    document.getElementById('editRoomW').addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (!isNaN(val) && val >= 2.0 && val <= 15.0) {
        room.width = val;
        saveProject();
        renderLayersTree();
        resizeCanvas();
        updateTopSummary();
      }
    });

    document.getElementById('editRoomH').addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (!isNaN(val) && val >= 2.0 && val <= 15.0) {
        room.height = val;
        saveProject();
        renderLayersTree();
        resizeCanvas();
        updateTopSummary();
      }
    });

    const deleteRoomBtn = document.getElementById('btnDeleteRoom');
    if (deleteRoomBtn) {
      deleteRoomBtn.addEventListener('click', () => {
        if (projectRooms.length <= 1) return;
        projectRooms = projectRooms.filter(r => r.id !== room.id);
        currentRoomId = projectRooms[0].id;
        selectedType = null;
        selectedId = null;
        saveProject();
        resizeCanvas();
        renderRoomPills();
        renderLayersTree();
        updateUI();
        showToast('Cômodo excluído.');
      });
    }
    return;
  }

  // CASE 5: NOTHING SELECTED
  container.innerHTML = `
    <div class="text-center py-2 text-slate-400">
      <svg class="w-6 h-6 mx-auto mb-1 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"/></svg>
      <p class="text-xs font-medium text-slate-600">Nenhum item selecionado</p>
      <p class="text-[11px] text-slate-400 mt-0.5">Clique em um móvel, porta, janela ou cômodo para editar.</p>
    </div>
  `;
}

function syncInspectorValues() {
  if (selectedType === 'furniture' && selectedId) {
    const room = getCurrentRoom();
    const item = room.items.find(it => it.id === selectedId);
    if (item) {
      const wInput = document.getElementById('editFurnW');
      const hInput = document.getElementById('editFurnH');
      if (wInput) wInput.value = item.w.toFixed(2);
      if (hInput) hInput.value = item.h.toFixed(2);
    }
  } else if (selectedType === 'door') {
    const room = getCurrentRoom();
    const door = room.door;
    if (door) {
      const wallSelect = document.getElementById('editDoorWall');
      const posInput = document.getElementById('editDoorPos');
      if (wallSelect) wallSelect.value = door.wall;
      if (posInput) posInput.value = door.pos.toFixed(2);
    }
  } else if (selectedType === 'window' && selectedId) {
    const room = getCurrentRoom();
    const win = room.windows ? room.windows.find(w => w.id === selectedId) : null;
    if (win) {
      const wallSelect = document.getElementById('editWinWall');
      const posInput = document.getElementById('editWinPos');
      if (wallSelect) wallSelect.value = win.wall;
      if (posInput) posInput.value = win.pos.toFixed(2);
    }
  }
}

function renderRoomPills() {
  const container = document.getElementById('roomPillsContainer');
  container.innerHTML = '';

  projectRooms.forEach((r) => {
    const isActive = (r.id === currentRoomId);
    const pill = document.createElement('button');
    pill.className = `text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 active:scale-95 ${
      isActive 
        ? 'bg-white text-purple-900 shadow-md font-extrabold ring-1 ring-white/50' 
        : 'text-purple-100 hover:bg-white/10'
    }`;

    pill.innerHTML = `
      <span>${SVG_ICONS.room}</span>
      <span>${r.name}</span>
      <span class="text-[10px] ${isActive ? 'text-purple-700' : 'text-purple-300'} font-mono">(${r.width.toFixed(1)}×${r.height.toFixed(1)}m)</span>
    `;

    pill.addEventListener('click', () => {
      if (currentRoomId !== r.id) {
        currentRoomId = r.id;
        selectedType = 'room';
        selectedId = r.id;
        resizeCanvas();
        renderRoomPills();
        renderLayersTree();
        updateUI();
      }
    });

    container.appendChild(pill);
  });
}

function updateTopSummary() {
  const room = getCurrentRoom();
  const area = (room.width * room.height).toFixed(1);
  document.getElementById('topRoomSummary').textContent = `${room.name} • ${room.width.toFixed(1)} × ${room.height.toFixed(1)} m (${area} m²) • ${room.items.length} móveis`;
}

function updateUI() {
  updateTopSummary();
  renderLayersTree();
  renderInspector();
}

// CREATE ITEM MODAL
document.getElementById('btnCreateItem').addEventListener('click', () => {
  document.getElementById('modalCreateItem').classList.remove('hidden');
});
document.getElementById('btnCloseModalCreate').addEventListener('click', () => {
  document.getElementById('modalCreateItem').classList.add('hidden');
});
document.getElementById('btnCancelCreateItem').addEventListener('click', () => {
  document.getElementById('modalCreateItem').classList.add('hidden');
});

document.querySelectorAll('.preset-color').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('inputNewColor').value = btn.dataset.color;
  });
});

document.getElementById('btnConfirmCreateItem').addEventListener('click', () => {
  const name = document.getElementById('inputNewName').value.trim() || 'Novo Móvel';
  const w = parseFloat(document.getElementById('inputNewW').value) || 1.0;
  const h = parseFloat(document.getElementById('inputNewH').value) || 1.0;
  const color = document.getElementById('inputNewColor').value || '#8b5cf6';

  const room = getCurrentRoom();
  const newItem = {
    id: 'item_' + Date.now(),
    name,
    w,
    h,
    x: Math.max(0.1, (room.width - w) / 2),
    y: Math.max(0.1, (room.height - h) / 2),
    rotation: 0,
    color
  };

  room.items.push(newItem);
  selectedType = 'furniture';
  selectedId = newItem.id;

  checkCollisions();
  saveProject();
  document.getElementById('modalCreateItem').classList.add('hidden');
  updateUI();
  showToast(`'${name}' adicionado!`);
});

// CATALOG MODAL
document.getElementById('btnCatalog').addEventListener('click', () => {
  document.getElementById('modalCatalog').classList.remove('hidden');
});
document.getElementById('btnCloseCatalog').addEventListener('click', () => {
  document.getElementById('modalCatalog').classList.add('hidden');
});

document.querySelectorAll('.btn-catalog-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.name;
    const w = parseFloat(btn.dataset.w);
    const h = parseFloat(btn.dataset.h);
    const color = btn.dataset.color;

    const room = getCurrentRoom();
    const newItem = {
      id: 'item_' + Date.now(),
      name,
      w,
      h,
      x: Math.max(0.1, (room.width - w) / 2),
      y: Math.max(0.1, (room.height - h) / 2),
      rotation: 0,
      color
    };

    room.items.push(newItem);
    selectedType = 'furniture';
    selectedId = newItem.id;

    checkCollisions();
    saveProject();
    document.getElementById('modalCatalog').classList.add('hidden');
    updateUI();
    showToast(`'${name}' inserido.`);
  });
});

// QUICK BUTTONS
document.getElementById('btnQuickRotate').addEventListener('click', rotateSelectedItem);
document.getElementById('btnQuickAddWindow').addEventListener('click', () => {
  const room = getCurrentRoom();
  if (!room.windows) room.windows = [];
  const newWin = {
    id: 'w_' + Date.now(),
    wall: 'top',
    pos: 0.5,
    width: 1.2
  };
  room.windows.push(newWin);
  selectedType = 'window';
  selectedId = newWin.id;
  saveProject();
  updateUI();
  showToast('Nova Janela adicionada na parede superior.');
});

// NEW ROOM
document.getElementById('btnNewRoom').addEventListener('click', () => {
  const roomNumber = projectRooms.length + 1;
  const newRoom = {
    id: 'room_' + Date.now(),
    name: `Cômodo ${roomNumber}`,
    width: 4.0,
    height: 3.5,
    door: { wall: 'bottom', pos: 0.5, width: 0.8 },
    windows: [
      { id: 'w_' + Date.now(), wall: 'top', pos: 1.0, width: 1.4 }
    ],
    items: []
  };

  projectRooms.push(newRoom);
  currentRoomId = newRoom.id;
  selectedType = 'room';
  selectedId = newRoom.id;

  saveProject();
  resizeCanvas();
  renderRoomPills();
  renderLayersTree();
  updateUI();
  showToast(`'${newRoom.name}' criado com sucesso.`);
});

// EXPORT PNG
document.getElementById('btnExportPNG').addEventListener('click', () => {
  const room = getCurrentRoom();
  const tempLink = document.createElement('a');
  tempLink.download = `${room.name.toLowerCase().replace(/\s+/g, '_')}_planta.png`;
  tempLink.href = canvas.toDataURL('image/png');
  tempLink.click();
  showToast('Planta exportada em alta resolução.');
});

// KEYBOARD SHORTCUTS
window.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

  if (e.key === 'r' || e.key === 'R') {
    rotateSelectedItem();
  }

  if (e.key === 'Delete' || e.key === 'Backspace') {
    if (selectedType === 'furniture' && selectedId) {
      const room = getCurrentRoom();
      room.items = room.items.filter(it => it.id !== selectedId);
      selectedType = null;
      selectedId = null;
      checkCollisions();
      saveProject();
      updateUI();
      showToast('Móvel excluído.');
    } else if (selectedType === 'window' && selectedId) {
      const room = getCurrentRoom();
      room.windows = room.windows.filter(w => w.id !== selectedId);
      selectedType = null;
      selectedId = null;
      saveProject();
      updateUI();
      showToast('Janela excluída.');
    }
  }
});

// MAIN RENDER LOOP
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawRoom();

  const room = getCurrentRoom();
  if (room.items && room.items.length > 0) {
    room.items.forEach(it => drawFurniture(it));
  }

  requestAnimationFrame(render);
}

// INITIALIZATION
window.onload = function () {
  loadSavedProject();
  resizeCanvas();
  renderRoomPills();
  renderLayersTree();
  renderInspector();
  updateTopSummary();
  checkCollisions();

  // Observe container resize
  const observer = new ResizeObserver(() => {
    resizeCanvas();
  });
  observer.observe(document.getElementById('canvasInner'));

  requestAnimationFrame(render);
};
