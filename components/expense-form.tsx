"use client";

import { useMemo, useState } from "react";
import { addExpense } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";

type Person={id:string;full_name:string|null;email:string};

const CATEGORIES = ["FOOD", "RENT", "TRANSPORT", "FUN", "OTHER"];
const CAT_COLORS: Record<string, string> = {
  FOOD: "#6dcc5b",
  RENT: "#b06bff",
  TRANSPORT: "#ff7043",
  FUN: "#0ab7c4",
  OTHER: "#f2efe9"
};
const PERSON_COLORS = ["#ff7043", "#6dcc5b", "#b06bff", "#0ab7c4", "#ffe16a"];

export function ExpenseForm({groupId,people,currentUser}:{groupId:string;people:Person[];currentUser:string}){
  const [mode,setMode]=useState("equal");
  const [selected,setSelected]=useState<Record<string,boolean>>(()=>Object.fromEntries(people.map(p=>[p.id,true])));
  const [values,setValues]=useState<Record<string,string>>({});
  
  // IST Date handling
  const todayIST = useMemo(() => {
    const d = new Date();
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    const nd = new Date(utc + (3600000 * 5.5)); // IST is +5:30
    return nd.toISOString().slice(0,10);
  }, []);
  
  const [payer, setPayer] = useState(currentUser);
  const [category, setCategory] = useState("FOOD");
  
  const chosen=people.filter(p=>selected[p.id]);
  
  return <form className="form expense-form-new" action={addExpense} style={{display: "flex", flexDirection: "column", gap: "24px"}}>
    <input type="hidden" name="group_id" value={groupId}/>
    <input type="hidden" name="split_mode" value={mode}/>
    <input type="hidden" name="paid_by" value={payer}/>
    <input type="hidden" name="category" value={category}/>
    <input type="hidden" name="splits" value={JSON.stringify(chosen.map(p=>({user_id:p.id,value:Number(values[p.id]||0)})))}/>
    
    <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <label style={{fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace", color: "#b8a996", fontSize: "11px", letterSpacing: "0.04em", textTransform: "uppercase"}}>Description</label>
        <div style={{position: "relative", width: "20px", height: "20px"}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#b8a996" strokeWidth="2" style={{width: "16px", height: "16px", cursor: "pointer"}}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <input name="expense_date" type="date" defaultValue={todayIST} style={{position: "absolute", top: 0, left: 0, opacity: 0, width: "100%", height: "100%", cursor: "pointer"}}/>
        </div>
      </div>
      <input name="description" placeholder="What was this for?" required autoFocus style={{background: "transparent", border: "1px solid #f2efe9", color: "#f2efe9", padding: "16px", fontSize: "16px"}}/>
    </div>

    <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
      <label style={{fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace", color: "#b8a996", fontSize: "11px", letterSpacing: "0.04em", textTransform: "uppercase"}}>Amount</label>
      <div style={{position: "relative"}}>
        <span style={{position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "24px", color: "#b8a996", fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace"}}>₹</span>
        <input name="amount" type="number" min="0.01" step="0.01" inputMode="decimal" placeholder="0.00" required style={{background: "transparent", border: "1px solid #f2efe9", color: "#f2efe9", padding: "16px 16px 16px 40px", fontSize: "28px", fontWeight: 700, fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace", width: "100%"}}/>
      </div>
    </div>

    <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
      <label style={{fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace", color: "#b8a996", fontSize: "11px", letterSpacing: "0.04em", textTransform: "uppercase"}}>Paid By</label>
      <div style={{display: "flex", gap: "12px", flexWrap: "wrap"}}>
        {people.map((p, i) => (
          <div key={p.id} onClick={() => setPayer(p.id)} style={{
            width: "48px", height: "48px", borderRadius: "50%", display: "grid", placeItems: "center", cursor: "pointer",
            fontWeight: 800, fontSize: "20px", color: payer === p.id ? "#151625" : "#766d60",
            background: payer === p.id ? PERSON_COLORS[i % PERSON_COLORS.length] : "transparent",
            border: `2px solid ${payer === p.id ? PERSON_COLORS[i % PERSON_COLORS.length] : "#766d60"}`
          }}>
            {(p.full_name || p.email).slice(0,1).toUpperCase()}
          </div>
        ))}
      </div>
    </div>

    <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
      <label style={{fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace", color: "#b8a996", fontSize: "11px", letterSpacing: "0.04em", textTransform: "uppercase"}}>Split</label>
      <div style={{display: "flex", gap: "8px"}}>
        <button type="button" onClick={() => { setMode("equal"); setValues({}); }} style={{flex: 1, padding: "14px", background: mode === "equal" ? "#c291ff" : "transparent", color: mode === "equal" ? "#151625" : "#f2efe9", border: mode === "equal" ? "2px solid #c291ff" : "1px solid #766d60", fontWeight: 700, fontSize: "14px"}}>Equally</button>
        <button type="button" onClick={() => setMode("exact")} style={{flex: 1, padding: "14px", background: mode !== "equal" ? "#c291ff" : "transparent", color: mode !== "equal" ? "#151625" : "#f2efe9", border: mode !== "equal" ? "2px solid #c291ff" : "1px solid #766d60", fontWeight: 700, fontSize: "14px"}}>Unequally</button>
      </div>
      
      {mode !== "equal" && (
        <div style={{background: "#16130f", padding: "16px", border: "1px solid #3b362f", display: "flex", flexDirection: "column", gap: "12px"}}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px"}}>
            <span style={{fontSize: "12px", color: "#b8a996"}}>Advanced mode</span>
            <select value={mode} onChange={(e) => setMode(e.target.value)} style={{background: "transparent", border: "1px solid #766d60", color: "#f2efe9", padding: "4px 8px", fontSize: "12px"}}>
              <option value="exact">Exact amounts (₹)</option>
              <option value="percent">Percentages (%)</option>
            </select>
          </div>
          
          <div className="member-splits" style={{gap: "8px"}}>
            {people.map(p => (
              <label className="member-split" key={p.id} style={{border: "none", padding: "0", background: "transparent"}}>
                <span>
                  <input type="checkbox" checked={!!selected[p.id]} onChange={e => setSelected({...selected,[p.id]:e.target.checked})} style={{accentColor: "#c291ff"}}/>
                  {p.id === currentUser ? "You" : p.full_name || p.email}
                </span>
                <input 
                  aria-label={`Split for ${p.full_name||p.email}`} 
                  type="number" min="0" step="0.01" inputMode="decimal" 
                  value={values[p.id]||""} 
                  onChange={e=>setValues({...values,[p.id]:e.target.value})} 
                  placeholder={mode === "percent" ? "%" : "₹"}
                  style={{width: "80px", padding: "8px", background: "transparent", border: "1px solid #766d60", color: "#f2efe9", textAlign: "right"}}
                />
              </label>
            ))}
          </div>
        </div>
      )}
    </div>

    <div style={{display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px"}}>
      <label style={{fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace", color: "#b8a996", fontSize: "11px", letterSpacing: "0.04em", textTransform: "uppercase"}}>Category</label>
      <div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
        {CATEGORIES.map(cat => (
          <button type="button" key={cat} onClick={() => setCategory(cat)} style={{
            padding: "8px 12px", 
            background: "transparent",
            color: category === cat ? CAT_COLORS[cat] : "#766d60",
            border: `1px solid ${category === cat ? CAT_COLORS[cat] : "#766d60"}`,
            fontWeight: 800, fontSize: "12px", fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace",
            textTransform: "uppercase", cursor: "pointer"
          }}>
            {cat}
          </button>
        ))}
      </div>
    </div>

    <SubmitButton pendingLabel="Adding..." style={{width: "100%", background: "#c291ff", color: "#151625", minHeight: "56px", fontSize: "16px", fontWeight: 800, border: "none"}}>
      Add expense
    </SubmitButton>
  </form>
}
