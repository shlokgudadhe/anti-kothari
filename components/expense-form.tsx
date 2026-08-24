"use client";

import { useMemo, useState } from "react";
import { addExpense } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";

type Person={id:string;full_name:string|null;email:string};

export function ExpenseForm({groupId,people,currentUser}:{groupId:string;people:Person[];currentUser:string}){
  const [mode,setMode]=useState("equal");
  const [selected,setSelected]=useState<Record<string,boolean>>(()=>Object.fromEntries(people.map(p=>[p.id,true])));
  const [values,setValues]=useState<Record<string,string>>({});
  const today=useMemo(()=>new Date().toISOString().slice(0,10),[]);
  const chosen=people.filter(p=>selected[p.id]);
  return <form className="form" action={addExpense}>
    <input type="hidden" name="group_id" value={groupId}/><input type="hidden" name="split_mode" value={mode}/>
    <input type="hidden" name="splits" value={JSON.stringify(chosen.map(p=>({user_id:p.id,value:Number(values[p.id]||0)})))}/>
    <label>Expense<input name="description" placeholder="Dinner, rent, groceries" required autoFocus/></label>
    <div className="form-row"><label>Amount (₹)<input name="amount" type="number" min="0.01" step="0.01" inputMode="decimal" placeholder="2400" required/></label><label>Date<input name="expense_date" type="date" defaultValue={today}/></label></div>
    <div className="form-row"><label>Paid by<select name="paid_by" defaultValue={currentUser}>{people.map(p=><option key={p.id} value={p.id}>{p.id===currentUser?"You":p.full_name||p.email}</option>)}</select></label><label>Category<select name="category" defaultValue="Other"><option>Food</option><option>Travel</option><option>Rent</option><option>Groceries</option><option>Fun</option><option>Other</option></select></label></div>
    <label>Split<select value={mode} onChange={e=>setMode(e.target.value)}><option value="equal">Equally</option><option value="exact">Exact amounts</option><option value="percent">Percentages</option></select></label>
    <div className="member-splits">{people.map(p=><label className="member-split" key={p.id}><span><input type="checkbox" checked={!!selected[p.id]} onChange={e=>setSelected({...selected,[p.id]:e.target.checked})}/>{p.id===currentUser?"You":p.full_name||p.email}</span>{mode!=="equal"&&<input aria-label={`Split for ${p.full_name||p.email}`} type="number" min="0" step="0.01" inputMode="decimal" value={values[p.id]||""} onChange={e=>setValues({...values,[p.id]:e.target.value})} placeholder={mode==="percent"?"%":"₹"}/>}</label>)}</div>
    <label>Note <span className="optional">optional</span><input name="notes" placeholder="Anything the group should know?"/></label>
    <SubmitButton pendingLabel="Adding expense…">Add expense</SubmitButton>
  </form>
}
