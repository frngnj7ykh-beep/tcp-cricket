/* =========================================================
   TCP Cricket — Stats, Awards & Leaderboards Add-On
   Standalone module: drop <script src="stats.js?v=1"></script>
   right before </body> in index.html
   ========================================================= */
(function () {
  if (window.__TCP_STATS_LOADED__) return;
  window.__TCP_STATS_LOADED__ = true;

  // --- 1. Inject Styles ---
  const style = document.createElement('style');
  style.textContent = `
    #tcp-stats-fab {
      position: fixed;
      bottom: 20px;
      right: 16px;
      z-index: 9990;
      background: linear-gradient(135deg, #10b981, #059669);
      color: #fff;
      border: none;
      border-radius: 999px;
      padding: 11px 16px;
      font-weight: 700;
      font-size: 14px;
      box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: system-ui, -apple-system, sans-serif;
    }
    #tcp-stats-fab:active { transform: scale(0.96); }

    #tcp-stats-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: #0b1120;
      color: #f8fafc;
      display: none;
      flex-direction: column;
      font-family: system-ui, -apple-system, sans-serif;
    }
    #tcp-stats-overlay.open { display: flex; }

    .tcps-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      background: #111827;
      border-bottom: 1px solid #1f2937;
    }
    .tcps-title { font-size: 17px; font-weight: 800; display: flex; align-items: center; gap: 8px; }
    .tcps-actions { display: flex; gap: 8px; align-items: center; }
    .tcps-btn {
      background: #1f2937;
      color: #e2e8f0;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 6px 11px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }
    .tcps-btn-green { background: #059669; border-color: #10b981; color: #fff; }
    .tcps-close {
      background: #1f2937;
      color: #f8fafc;
      border: none;
      border-radius: 8px;
      width: 34px;
      height: 34px;
      font-size: 18px;
      cursor: pointer;
    }

    .tcps-toolbar {
      display: flex;
      gap: 8px;
      padding: 10px 16px;
      background: #0f172a;
      border-bottom: 1px solid #1e293b;
      overflow-x: auto;
    }
    .tcps-tab {
      background: #1e293b;
      color: #94a3b8;
      border: 1px solid #334155;
      border-radius: 999px;
      padding: 6px 13px;
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
      cursor: pointer;
    }
    .tcps-tab.active {
      background: #10b981;
      color: #022c22;
      border-color: #10b981;
    }

    .tcps-filter-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 16px;
      background: #0b1120;
      font-size: 12px;
      color: #94a3b8;
      gap: 8px;
    }
    .tcps-select {
      background: #1e293b;
      color: #f8fafc;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 5px 10px;
      font-size: 12px;
    }

    .tcps-body {
      flex: 1;
      overflow-y: auto;
      padding: 12px 16px 80px;
    }

    .tcps-caps {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-bottom: 14px;
    }
    .tcps-cap-card {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 12px;
      padding: 10px;
      text-align: center;
      cursor: pointer;
    }
    .tcps-cap-card.orange { border-color: #f97316; background: linear-gradient(180deg, rgba(249,115,22,0.14), #111827); }
    .tcps-cap-card.purple { border-color: #a855f7; background: linear-gradient(180deg, rgba(168,85,247,0.14), #111827); }
    .tcps-cap-card.gold   { border-color: #eab308; background: linear-gradient(180deg, rgba(234,179,8,0.14), #111827); }
    .tcps-cap-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #cbd5e1; font-weight: 700; }
    .tcps-cap-name { font-size: 13px; font-weight: 800; margin: 4px 0 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .tcps-cap-val { font-size: 15px; font-weight: 900; color: #10b981; }

    .tcps-table-wrap {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 12px;
      overflow-x: auto;
    }
    .tcps-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    .tcps-table th {
      text-align: right;
      padding: 10px 8px;
      color: #94a3b8;
      font-weight: 700;
      border-bottom: 1px solid #1f2937;
      white-space: nowrap;
    }
    .tcps-table th:first-child, .tcps-table td:first-child { text-align: left; padding-left: 12px; }
    .tcps-table td {
      text-align: right;
      padding: 10px 8px;
      border-bottom: 1px solid #1e293b;
      white-space: nowrap;
    }
    .tcps-table tr:last-child td { border-bottom: none; }
    .tcps-player-link {
      color: #38bdf8;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
    }
    .tcps-rank {
      display: inline-block;
      width: 20px;
      color: #64748b;
      font-weight: 700;
    }

    .tcps-award-card {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 12px;
      padding: 12px;
      margin-bottom: 10px;
    }
    .tcps-award-top { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
    .tcps-award-match { font-size: 13px; font-weight: 700; color: #f8fafc; }
    .tcps-award-date { font-size: 11px; color: #94a3b8; }
    .tcps-award-winner {
      margin-top: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(234, 179, 8, 0.12);
      border: 1px solid rgba(234, 179, 8, 0.35);
      border-radius: 8px;
      padding: 8px 10px;
      cursor: pointer;
    }

    .tcps-profile-modal {
      position: fixed;
      inset: 0;
      z-index: 10005;
      background: rgba(2, 6, 23, 0.85);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .tcps-profile-modal.open { display: flex; }
    .tcps-profile-box {
      width: 100%;
      max-width: 420px;
      max-height: 85vh;
      overflow-y: auto;
      background: #111827;
      border: 1px solid #334155;
      border-radius: 16px;
      padding: 16px;
    }
    .tcps-stat-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin: 12px 0;
    }
    .tcps-stat-tile {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 10px;
      padding: 8px;
      text-align: center;
    }
    .tcps-stat-tile b { display: block; font-size: 15px; color: #f8fafc; }
    .tcps-stat-tile span { font-size: 10px; color: #94a3b8; text-transform: uppercase; }
    .tcps-empty {
      text-align: center;
      padding: 40px 16px;
      color: #94a3b8;
      font-size: 14px;
    }
  `;
  document.head.appendChild(style);

  // --- 2. State ---
  let activeTab = 'batting';
  let activeFilter = 'all';
  let cachedMatches = [];

  // --- 3. Smart Match Discovery (LocalStorage + Firestore) ---
  function isMatchObject(obj) {
    if (!obj || typeof obj !== 'object') return false;
    return Array.isArray(obj.innings) && obj.innings.length > 0 && (obj.teamA || obj.team1 || obj.teams);
  }

  function extractMatchesFromAny(val, out, seen) {
    if (!val || typeof val !== 'object') return;
    if (Array.isArray(val)) {
      val.forEach(item => extractMatchesFromAny(item, out, seen));
      return;
    }
    if (isMatchObject(val)) {
      const id = val.id || JSON.stringify([val.teamA || val.team1, val.teamB || val.team2, val.date || val.createdAt, val.innings[0]?.runs]);
      if (!seen.has(id)) {
        seen.add(id);
        out.push(val);
      }
      return;
    }
    ['history', 'matches', 'savedMatches', 'currentMatch', 'activeMatch', 'match'].forEach(k => {
      if (val[k]) extractMatchesFromAny(val[k], out, seen);
    });
  }

  async function loadAllMatches() {
    const out = [];
    const seen = new Set();

    // 1. Scan localStorage
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const raw = localStorage.getItem(key);
        if (!raw || (raw[0] !== '{' && raw[0] !== '[')) continue;
        try {
          const parsed = JSON.parse(raw);
          extractMatchesFromAny(parsed, out, seen);
        } catch (_) {}
      }
    } catch (_) {}

    // 2. Scan Firestore if Firebase compat is active
    try {
      if (window.firebase && firebase.apps && firebase.apps.length && firebase.firestore) {
        const db = firebase.firestore();
        const tryDocs = [
          ['tcp_cricket', 'state'],
          ['tcp_cricket', 'history'],
          ['tcp_cricket', 'matches'],
          ['tcp_cricket', 'current'],
          ['tcp_cricket', 'live']
        ];
        await Promise.all(tryDocs.map(async ([col, docId]) => {
          try {
            const snap = await db.collection(col).doc(docId).get();
            if (snap.exists) extractMatchesFromAny(snap.data(), out, seen);
          } catch (_) {}
        }));
        try {
          const colSnap = await db.collection('matches').get();
          colSnap.forEach(d => extractMatchesFromAny(d.data(), out, seen));
        } catch (_) {}
      }
    } catch (_) {}

    // Sort newest first
    out.sort((a, b) => {
      const da = new Date(a.date || a.createdAt || a.updatedAt || 0).getTime();
      const db = new Date(b.date || b.createdAt || b.updatedAt || 0).getTime();
      return db - da;
    });

    cachedMatches = out;
    return out;
  }

  // --- 4. Flexible Cricket Stats Engine ---
  function normName(n) {
    return String(n || '').trim().replace(/\s+/g, ' ');
  }

  function toArray(collection) {
    if (!collection) return [];
    if (Array.isArray(collection)) return collection;
    if (typeof collection === 'object') {
      return Object.entries(collection).map(([k, v]) =>
        typeof v === 'object' ? Object.assign({ name: v.name || k }, v) : { name: k }
      );
    }
    return [];
  }

  function parseOversToBalls(b) {
    if (typeof b.balls === 'number' && b.balls > 0) return b.balls;
    if (typeof b.legalBalls === 'number' && b.legalBalls > 0) return b.legalBalls;
    const ov = parseFloat(b.overs || b.o || 0);
    if (!ov) return 0;
    const whole = Math.floor(ov);
    const rem = Math.round((ov - whole) * 10);
    return whole * 6 + rem;
  }

  function ballsToOvers(balls) {
    return `${Math.floor(balls / 6)}.${balls % 6}`;
  }

  function extractFielder(dismissalText, explicitFielder) {
    if (explicitFielder) return normName(explicitFielder);
    const txt = String(dismissalText || '');
    // Matches "c Ravi b Ram" or "c Ravi"
    let m = txt.match(/\bc\s+([A-Za-z0-9 ._-]+?)(?:\s+b\s+|$)/i);
    if (m && m[1] && !/^&\s*b$/i.test(m[1].trim())) return normName(m[1]);
    // Matches "st Ravi b Ram"
    m = txt.match(/\bst\s+([A-Za-z0-9 ._-]+?)(?:\s+b\s+|$)/i);
    if (m && m[1]) return normName(m[1]);
    // Matches "run out (Kiran)"
    m = txt.match(/run\s*out\s*\(([^)]+)\)/i);
    if (m && m[1]) return normName(m[1]);
    return '';
  }

  function computeStats(matches) {
    const players = {};
    const matchAwards = [];

    const getP = (rawName) => {
      const name = normName(rawName);
      if (!name || name === 'Unknown' || name === '-') return null;
      const key = name.toLowerCase();
      if (!players[key]) {
        players[key] = {
          name,
          matches: new Set(),
          innings: 0,
          notOuts: 0,
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          hs: 0,
          hsNotOut: false,
          thirties: 0,
          fifties: 0,
          bowlInnings: 0,
          bowlBalls: 0,
          bowlRuns: 0,
          wickets: 0,
          maidens: 0,
          threeW: 0,
          bestW: -1,
          bestR: 999,
          catches: 0,
          mvps: 0,
          totalMvpPts: 0
        };
      }
      return players[key];
    };

    matches.forEach((match, mIdx) => {
      const matchId = match.id || `m_${mIdx}`;
      const mPts = {};
      const addPts = (name, pts, summary) => {
        const key = normName(name).toLowerCase();
        if (!key) return;
        if (!mPts[key]) mPts[key] = { name: normName(name), pts: 0, parts: [] };
        mPts[key].pts += pts;
        if (summary) mPts[key].parts.push(summary);
      };

      (match.innings || []).forEach(inn => {
        // Batting
        const batters = toArray(inn.batters || inn.batsmen || inn.batting);
        batters.forEach(bt => {
          const runs = Number(bt.runs ?? bt.r ?? 0);
          const balls = Number(bt.balls ?? bt.b ?? 0);
          const fours = Number(bt.fours ?? bt['4s'] ?? 0);
          const sixes = Number(bt.sixes ?? bt['6s'] ?? 0);
          const howOut = String(bt.dismissal || bt.howOut || bt.status || '');
          const isOut = Boolean(bt.out || bt.isOut || (howOut && !/not\s*out|batting|retired\s*hurt/i.test(howOut)));

          if (balls === 0 && runs === 0 && !isOut) return;
          const p = getP(bt.name);
          if (!p) return;

          p.matches.add(matchId);
          p.innings += 1;
          if (!isOut) p.notOuts += 1;
          p.runs += runs;
          p.balls += balls;
          p.fours += fours;
          p.sixes += sixes;
          if (runs > p.hs || (runs === p.hs && !isOut && !p.hsNotOut)) {
            p.hs = runs;
            p.hsNotOut = !isOut;
          }
          if (runs >= 50) p.fifties += 1;
          else if (runs >= 30) p.thirties += 1;

          // MVP batting points
          let batPts = runs + fours * 1 + sixes * 2;
          if (runs >= 50) batPts += 15;
          else if (runs >= 30) batPts += 8;
          if (balls >= 10 && (runs / balls) * 100 >= 150) batPts += 6;
          addPts(p.name, batPts, `${runs}${!isOut ? '*' : ''}(${balls})`);

          // Fielding credit
          const fielder = extractFielder(howOut, bt.fielder);
          if (fielder) {
            const fp = getP(fielder);
            if (fp) {
              fp.matches.add(matchId);
              fp.catches += 1;
              addPts(fp.name, 10, '1 ct/ro');
            }
          }
        });

        // Bowling
        const bowlers = toArray(inn.bowlers || inn.bowling);
        bowlers.forEach(bw => {
          const bBalls = parseOversToBalls(bw);
          const bRuns = Number(bw.runs ?? bw.r ?? 0);
          const wkts = Number(bw.wickets ?? bw.w ?? 0);
          const maidens = Number(bw.maidens ?? bw.m ?? 0);
          if (bBalls === 0 && wkts === 0 && bRuns === 0) return;

          const p = getP(bw.name);
          if (!p) return;

          p.matches.add(matchId);
          p.bowlInnings += 1;
          p.bowlBalls += bBalls;
          p.bowlRuns += bRuns;
          p.wickets += wkts;
          p.maidens += maidens;
          if (wkts >= 3) p.threeW += 1;
          if (wkts > p.bestW || (wkts === p.bestW && bRuns < p.bestR)) {
            p.bestW = wkts;
            p.bestR = bRuns;
          }

          // MVP bowling points
          let bowlPts = wkts * 22 + maidens * 6;
          if (wkts >= 3) bowlPts += 12;
          const econ = bBalls >= 6 ? (bRuns / (bBalls / 6)) : 99;
          if (econ <= 6) bowlPts += 8;
          else if (econ <= 8) bowlPts += 4;
          addPts(p.name, bowlPts, `${wkts}/${bRuns}`);
        });
      });

      // Pick Match MVP
      const ranked = Object.values(mPts).sort((a, b) => b.pts - a.pts);
      if (ranked.length > 0) {
        const top = ranked[0];
        const wp = getP(top.name);
        if (wp) {
          wp.mvps += 1;
          wp.totalMvpPts += top.pts;
        }
        const tA = match.teamA?.name || match.teamA || match.team1 || 'Team A';
        const tB = match.teamB?.name || match.teamB || match.team2 || 'Team B';
        matchAwards.push({
          title: `${tA} vs ${tB}`,
          date: match.date || match.createdAt || '',
          result: match.result || match.status || '',
          mvpName: top.name,
          mvpPts: Math.round(top.pts),
          summary: top.parts.join(' & ')
        });
      }
    });

    const list = Object.values(players).map(p => {
      const outs = p.innings - p.notOuts;
      p.matchCount = p.matches.size;
      p.avg = outs > 0 ? (p.runs / outs).toFixed(1) : (p.runs > 0 ? '∞' : '0.0');
      p.sr = p.balls > 0 ? ((p.runs / p.balls) * 100).toFixed(1) : '0.0';
      p.econ = p.bowlBalls > 0 ? (p.bowlRuns / (p.bowlBalls / 6)).toFixed(2) : '-';
      p.bestFig = p.bestW >= 0 ? `${p.bestW}/${p.bestR}` : '-';
      return p;
    });

    return { players: list, matchAwards };
  }

  function filterMatches(matches) {
    if (activeFilter === 'last5') return matches.slice(0, 5);
    if (activeFilter === 'month') {
      const now = new Date();
      return matches.filter(m => {
        const d = new Date(m.date || m.createdAt || 0);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
    }
    return matches;
  }

  // --- 5. Build UI ---
  const fab = document.createElement('button');
  fab.id = 'tcp-stats-fab';
  fab.innerHTML = '🏆 Stats';
  document.body.appendChild(fab);

  const overlay = document.createElement('div');
  overlay.id = 'tcp-stats-overlay';
  overlay.innerHTML = `
    <div class="tcps-header">
      <div class="tcps-title">🏆 TCP Stats & Awards</div>
      <div class="tcps-actions">
        <button class="tcps-btn tcps-btn-green" id="tcps-share-wa">Share WA</button>
        <button class="tcps-btn" id="tcps-refresh">↻</button>
        <button class="tcps-close" id="tcps-close">✕</button>
      </div>
    </div>
    <div class="tcps-toolbar">
      <button class="tcps-tab active" data-tab="batting">🧡 Orange Cap</button>
      <button class="tcps-tab" data-tab="bowling">💜 Purple Cap</button>
      <button class="tcps-tab" data-tab="mvp">🏆 MVP Awards</button>
      <button class="tcps-tab" data-tab="fielding">💥 Sixes & Field</button>
    </div>
    <div class="tcps-filter-row">
      <span id="tcps-match-count">Loading matches...</span>
      <select class="tcps-select" id="tcps-filter">
        <option value="all">All Matches</option>
        <option value="month">This Month</option>
        <option value="last5">Last 5 Matches</option>
      </select>
    </div>
    <div class="tcps-body" id="tcps-body"></div>
  `;
  document.body.appendChild(overlay);

  const profileModal = document.createElement('div');
  profileModal.className = 'tcps-profile-modal';
  profileModal.innerHTML = `<div class="tcps-profile-box" id="tcps-profile-box"></div>`;
  document.body.appendChild(profileModal);

  let latestStats = { players: [], matchAwards: [] };

  function openProfile(playerName) {
    const p = latestStats.players.find(x => x.name.toLowerCase() === playerName.toLowerCase());
    if (!p) return;
    const box = document.getElementById('tcps-profile-box');
    box.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="font-size:18px;font-weight:800;">${p.name}</div>
          <div style="font-size:12px;color:#94a3b8;">TCP Career Profile • ${p.matchCount} Matches</div>
        </div>
        <button class="tcps-close" id="tcps-prof-close">✕</button>
      </div>
      <div style="margin-top:12px;font-size:11px;font-weight:700;color:#f97316;text-transform:uppercase;">Batting</div>
      <div class="tcps-stat-grid">
        <div class="tcps-stat-tile"><b>${p.runs}</b><span>Runs</span></div>
        <div class="tcps-stat-tile"><b>${p.hs}${p.hsNotOut ? '*' : ''}</b><span>High Score</span></div>
        <div class="tcps-stat-tile"><b>${p.sr}</b><span>Strike Rate</span></div>
        <div class="tcps-stat-tile"><b>${p.avg}</b><span>Average</span></div>
        <div class="tcps-stat-tile"><b>${p.fours} / ${p.sixes}</b><span>4s / 6s</span></div>
        <div class="tcps-stat-tile"><b>${p.thirties} / ${p.fifties}</b><span>30s / 50s</span></div>
      </div>
      <div style="margin-top:8px;font-size:11px;font-weight:700;color:#a855f7;text-transform:uppercase;">Bowling & Awards</div>
      <div class="tcps-stat-grid">
        <div class="tcps-stat-tile"><b>${p.wickets}</b><span>Wickets</span></div>
        <div class="tcps-stat-tile"><b>${p.bestFig}</b><span>Best Fig</span></div>
        <div class="tcps-stat-tile"><b>${p.econ}</b><span>Economy</span></div>
        <div class="tcps-stat-tile"><b>${ballsToOvers(p.bowlBalls)}</b><span>Overs</span></div>
        <div class="tcps-stat-tile"><b>${p.catches}</b><span>Catches/RO</span></div>
        <div class="tcps-stat-tile"><b style="color:#eab308;">${p.mvps}</b><span>MVP Awards</span></div>
      </div>
    `;
    profileModal.classList.add('open');
    document.getElementById('tcps-prof-close').onclick = () => profileModal.classList.remove('open');
  }

  profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) profileModal.classList.remove('open');
  });

  function render() {
    const filtered = filterMatches(cachedMatches);
    document.getElementById('tcps-match-count').textContent = `${filtered.length} match${filtered.length === 1 ? '' : 'es'} analyzed`;
    const body = document.getElementById('tcps-body');

    if (!filtered.length) {
      body.innerHTML = `<div class="tcps-empty">No saved matches found yet.<br><br>Score or save a match in TCP and tap <b>↻</b> to see live leaderboards and MVP awards!</div>`;
      return;
    }

    latestStats = computeStats(filtered);
    const { players, matchAwards } = latestStats;

    const byRuns = [...players].filter(p => p.innings > 0).sort((a, b) => b.runs - a.runs || parseFloat(b.sr) - parseFloat(a.sr));
    const byWkts = [...players].filter(p => p.bowlBalls > 0).sort((a, b) => b.wickets - a.wickets || parseFloat(a.econ) - parseFloat(b.econ));
    const byMvp = [...players].filter(p => p.mvps > 0).sort((a, b) => b.mvps - a.mvps || b.totalMvpPts - a.totalMvpPts);
    const bySix = [...players].filter(p => p.sixes > 0 || p.fours > 0 || p.catches > 0).sort((a, b) => b.sixes - a.sixes || b.catches - a.catches);

    const orange = byRuns[0];
    const purple = byWkts[0];
    const mvpTop = byMvp[0];

    let html = `
      <div class="tcps-caps">
        <div class="tcps-cap-card orange" data-player="${orange ? orange.name : ''}">
          <div class="tcps-cap-label">🧡 Orange Cap</div>
          <div class="tcps-cap-name">${orange ? orange.name : '-'}</div>
          <div class="tcps-cap-val">${orange ? orange.runs + ' runs' : '-'}</div>
        </div>
        <div class="tcps-cap-card purple" data-player="${purple ? purple.name : ''}">
          <div class="tcps-cap-label">💜 Purple Cap</div>
          <div class="tcps-cap-name">${purple ? purple.name : '-'}</div>
          <div class="tcps-cap-val">${purple ? purple.wickets + ' wkts' : '-'}</div>
        </div>
        <div class="tcps-cap-card gold" data-player="${mvpTop ? mvpTop.name : ''}">
          <div class="tcps-cap-label">🏆 Top MVP</div>
          <div class="tcps-cap-name">${mvpTop ? mvpTop.name : '-'}</div>
          <div class="tcps-cap-val">${mvpTop ? mvpTop.mvps + ' awards' : '-'}</div>
        </div>
      </div>
    `;

    if (activeTab === 'batting') {
      html += `
        <div class="tcps-table-wrap">
          <table class="tcps-table">
            <thead><tr><th>Player</th><th>Inn</th><th>Runs</th><th>HS</th><th>Avg</th><th>SR</th><th>4s/6s</th></tr></thead>
            <tbody>
              ${byRuns.map((p, i) => `
                <tr>
                  <td><span class="tcps-rank">${i + 1}</span><a class="tcps-player-link" data-player="${p.name}">${p.name}</a></td>
                  <td>${p.innings}</td>
                  <td><b>${p.runs}</b></td>
                  <td>${p.hs}${p.hsNotOut ? '*' : ''}</td>
                  <td>${p.avg}</td>
                  <td>${p.sr}</td>
                  <td>${p.fours}/${p.sixes}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else if (activeTab === 'bowling') {
      html += `
        <div class="tcps-table-wrap">
          <table class="tcps-table">
            <thead><tr><th>Player</th><th>Ov</th><th>Wkts</th><th>Runs</th><th>Best</th><th>Econ</th></tr></thead>
            <tbody>
              ${byWkts.map((p, i) => `
                <tr>
                  <td><span class="tcps-rank">${i + 1}</span><a class="tcps-player-link" data-player="${p.name}">${p.name}</a></td>
                  <td>${ballsToOvers(p.bowlBalls)}</td>
                  <td><b>${p.wickets}</b></td>
                  <td>${p.bowlRuns}</td>
                  <td>${p.bestFig}</td>
                  <td>${p.econ}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else if (activeTab === 'fielding') {
      html += `
        <div class="tcps-table-wrap">
          <table class="tcps-table">
            <thead><tr><th>Player</th><th>6s</th><th>4s</th><th>Catches/RO</th><th>M</th></tr></thead>
            <tbody>
              ${bySix.map((p, i) => `
                <tr>
                  <td><span class="tcps-rank">${i + 1}</span><a class="tcps-player-link" data-player="${p.name}">${p.name}</a></td>
                  <td><b>${p.sixes}</b></td>
                  <td>${p.fours}</td>
                  <td>${p.catches}</td>
                  <td>${p.matchCount}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else if (activeTab === 'mvp') {
      html += matchAwards.map(a => `
        <div class="tcps-award-card">
          <div class="tcps-award-top">
            <div class="tcps-award-match">${a.title}</div>
            <div class="tcps-award-date">${a.date ? String(a.date).slice(0, 10) : ''}</div>
          </div>
          ${a.result ? `<div style="font-size:11px;color:#10b981;margin-top:2px;">${a.result}</div>` : ''}
          <div class="tcps-award-winner" data-player="${a.mvpName}">
            <div>
              <div style="font-size:11px;color:#fde047;font-weight:700;">🏆 PLAYER OF THE MATCH</div>
              <div style="font-size:14px;font-weight:800;">${a.mvpName}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:13px;font-weight:800;color:#fde047;">${a.mvpPts} pts</div>
              <div style="font-size:11px;color:#cbd5e1;">${a.summary}</div>
            </div>
          </div>
        </div>
      `).join('');
    }

    body.innerHTML = html;

    // Bind player profile taps
    body.querySelectorAll('[data-player]').forEach(el => {
      const name = el.getAttribute('data-player');
      if (name) el.onclick = () => openProfile(name);
    });
  }

  // --- 6. WhatsApp Leaderboard Share ---
  function shareWhatsApp() {
    const { players } = latestStats;
    if (!players.length) return;
    const topBat = [...players].filter(p => p.innings > 0).sort((a, b) => b.runs - a.runs).slice(0, 5);
    const topBowl = [...players].filter(p => p.bowlBalls > 0).sort((a, b) => b.wickets - a.wickets).slice(0, 5);
    const topMvp = [...players].filter(p => p.mvps > 0).sort((a, b) => b.mvps - a.mvps).slice(0, 3);

    const lines = [
      `🏏 *TAMARIND CRICKET PLAYERS (TCP)*`,
      `🏆 *Season Leaderboard (${activeFilter === 'all' ? 'All Time' : activeFilter === 'month' ? 'This Month' : 'Last 5 Matches'})*`,
      ``,
      `🧡 *ORANGE CAP (Top Runs)*`,
      ...topBat.map((p, i) => `${i + 1}. ${p.name} — *${p.runs}* (${p.innings} inn, SR ${p.sr})`),
      ``,
      `💜 *PURPLE CAP (Top Wickets)*`,
      ...topBowl.map((p, i) => `${i + 1}. ${p.name} — *${p.wickets}w* (Best ${p.bestFig}, Econ ${p.econ})`),
      ``,
      `🌟 *MOST MVP AWARDS*`,
      ...topMvp.map((p, i) => `${i + 1}. ${p.name} — *${p.mvps}*`),
      ``,
      `📲 Live Scores: ${window.location.href.split('?')[0]}`
    ];

    const text = lines.join('\n');
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
  }

  // --- 7. Events ---
  fab.onclick = async () => {
    overlay.classList.add('open');
    await loadAllMatches();
    render();
  };
  document.getElementById('tcps-close').onclick = () => overlay.classList.remove('open');
  document.getElementById('tcps-refresh').onclick = async () => {
    await loadAllMatches();
    render();
  };
  document.getElementById('tcps-share-wa').onclick = shareWhatsApp;
  document.getElementById('tcps-filter').onchange = (e) => {
    activeFilter = e.target.value;
    render();
  };
  overlay.querySelectorAll('.tcps-tab').forEach(btn => {
    btn.onclick = () => {
      overlay.querySelectorAll('.tcps-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTab = btn.getAttribute('data-tab');
      render();
    };
  });
})();
