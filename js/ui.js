import React from "https://esm.sh/preact@10.11.3/compat";
import { html } from "https://esm.sh/htm@3.1.1/preact";
import * as Store from "./store.js";
import * as Tone from "./tone.js";

/** @typedef {({children, classes}:{children?:preact.ComponentChildren, classes?:string})=>preact.VNode} BasicElement */

/** @type {({children, icon, light, disabled, inactive, onClick, classes, classesActive}:{children:preact.VNode, icon?:preact.VNode, light:boolean, disabled:boolean, inactive:boolean, onClick:()=>void, classes?:string, classesActive?:string})=>preact.VNode} */
export function Button({children, icon, light, disabled, inactive, onClick, classes, classesActive})
{
    const [FlashGet, FlashSet] = React.useState(0);
    const handleClick =()=>
    {
        if(inactive||disabled){ return; }
        FlashSet(FlashGet+1);
        onClick();
    };

    return html`
    <button
        onClick=${handleClick}
        class="relative flex items-stretch shadow-sss rounded-md text(lg white) border-t(1 solid [#00000011]) border-b(2 solid [#ffffff]) ring-inset ring-black group transition-all duration-500 ${classes} ${disabled ? "bg-zinc-400" : (classesActive||"bg-gradient")} ${(inactive||disabled) && "cursor-default"}"
    >
        <span class="absolute top-0 left-0 w-full h-full rounded-lg bg-black transition-opacity duration-300 opacity-0 ${(!inactive && !disabled) && "group-hover:opacity-50"}"></span>
        ${ FlashGet > 0 && html`<span key=${FlashGet} class="absolute top-0 left-0 w-full h-full rounded-lg bg-green-400 shadow-glow-green-300 animate-flash"></span>` }
        
        ${ icon && html`<span class="flex items-center block relative px-2 border-r(1 [#00000088])">
            <span class="absolute top-0 left-0 w-full h-full bg-black rounded(tl-lg bl-lg) ${disabled ? "opacity-20" : "opacity-50"}"></span>
            <span class="relative">${icon}</span>
        </span>` }
        <div class="flex-1 flex items-center justify-center text-center font-bold px-3 py-2 relative border-l(1 [#ffffff22])">
            <span class="absolute shadow-glow-yellow-500 top-0 left-1/2 w-6 h-[6px] bg-white rounded-full translate(-x-1/2 -y-1/2) transition-all duration-500 ${light ? "opacity-100" : "opacity-0 scale-y-0"}"></span>
            ${children}
        </div>
    </button>`;
}

export const Header =(/** @type {{logo?:string}}*/props)=>
{
    const [State, Dispatch] = Store.Consumer();
    const grade = State.Live.Test?.Done || {Marks:0, Total:0, Score:0};

    /** @type {(e:Event)=>void} */
    const handleChangeCondition =(e)=> Dispatch({Name:"Test", Data:parseInt(/** @type {HTMLSelectElement}*/(e.target).value)});
    /** @type {(e:Event)=>void} */
    const handleChangeReliability =(e)=> Dispatch({Name:"Errs", Data:parseInt(/** @type {HTMLSelectElement}*/(e.target).value)});

    return html`
    <div class="flex flex-col lg:flex-row">

        ${ props.logo && html`<div class="p-4 box-border w-full lg:w-[350px] self-stretch">
            <img class="logo" src=${props.logo}/>
        </div>`}
        
        <div class="bg-metal rounded-lg shadow-md flex-1">
            <p class="text(center shadow-emboss slate-900) uppercase font-bold py-2">Test Patient</p>
            <div class="border-y-1 border-t-slate-300 border-b-white"></div>

            <div class="flex flex-col md:flex-row">
                <div class="p-2 pr-0 flex-1">
                    <div class="flex flex-wrap flex-row items-stretch box-buttons">
                        <p class="px-2 self-center text(center sm) font-bold lg:w-auto">Condition:</p>
                        <select id="test-select" class="flex-1 px-2 py-2 rounded-lg border(1 slate-200) font-bold text(md white center) cursor-pointer bg-gradient" value=${State.Pick} onChange=${handleChangeCondition}>
                            ${State.Test.map((t, i)=>html`<option class="text-black" value=${i}>${t.Name}</option>`)}
                        </select>
                    </div>
                </div>
                <div class="p-2 flex-2">
                    <div class="flex flex-wrap flex-row items-stretch box-buttons">
                        <p class="px-2 self-center text(center sm) font-bold lg:w-auto">Reliability:</p>
                        <select class="flex-1 px-2 py-2 rounded-lg border(1 slate-200) font-bold text(md white center) cursor-pointer bg-gradient" value=${State.Errs} onChange=${handleChangeReliability}>
                            <option class="text-black" value=${0}>Perfect (Training Mode)</option>
                            <option class="text-black" value=${1}>Good</option>
                            <option class="text-black" value=${2}>Reduced</option>
                            <option class="text-black" value=${3}>Poor</option>
                        </select>
                        <!--
                        <${Button} inactive=${State.Errs == 0} light=${State.Errs == 0} classes="basis-[calc(50%-2px)] md:flex-1 lg:flex-[1.5] text-xs" classesActive="bg-green-600"   onClick=${()=>Dispatch({Name:"Errs", Data:0})}><strong class="mr-1">Perfect</strong><span>(Training Mode)</span><//>
                        <${Button} inactive=${State.Errs == 1} light=${State.Errs == 1} classes="basis-[calc(50%-2px)] md:flex-1  font-bold   text-xs"  classesActive="bg-yellow-600" onClick=${()=>Dispatch({Name:"Errs", Data:1})}>Good<//>
                        <${Button} inactive=${State.Errs == 2} light=${State.Errs == 2} classes="basis-[calc(50%-2px)] md:flex-1  font-bold   text-xs"  classesActive="bg-orange-700" onClick=${()=>Dispatch({Name:"Errs", Data:2})}>Reduced<//>
                        <${Button} inactive=${State.Errs == 3} light=${State.Errs == 3} classes="basis-[calc(50%-2px)] md:flex-1  font-bold   text-xs"  classesActive="bg-red-800"     onClick=${()=>Dispatch({Name:"Errs", Data:3})}>Poor<//>
                        -->
                    </div>
                </div>
            </div>


        </div>



    </div>`;
}

/** @type {BasicElement} */
export const Display =()=>
{
    const [State, Dispatch] = Store.Consumer();
    const grade = State.Live.Test?.Done || {Marks:0, Total:0, Score:0};
    return html`
    
            <div class="flex bg-metal rounded-lg overflow-hidden shadow-md">
                <div class="p-2 flex-2">
                    <div class="box-buttons">
                        <p>Display</p>
                        <${Button} light=${State.Show.Cursor} classes="flex-1 text-xs" onClick=${()=>Dispatch({Name:"ShowCursor", Data:!State.Show.Cursor})}>Cursor<//>
                        <${Button} light=${State.Show.Answer} classes="flex-1 text-xs" onClick=${()=>Dispatch({Name:"ShowAnswer", Data:!State.Show.Answer})}>Answer<//>
                    </div>
                </div>
                <div class="p-2 flex-1">
                    <div class="box-buttons flex justify-center">
                        <div class="px-2 font-bold">Complete: ${grade.Marks} of ${grade.Total}</div>
                        <div class="flex-1 h-4 bg-zinc-400 rounded-full overflow-hidden">
                            <div class="h-full w-[${grade.Marks/grade.Total*100}%] bg-gradient"></div>
                        </div>
                        <div class="px-2 text-sm">Accuracy: ${grade.Score}%</div>
                        <${Button} disabled=${grade.Marks == 0} classes="text-xs" onClick=${()=>Dispatch({Name:"Kill", Data:0})}>Start Over<//>
                    </div>
                </div>
            </div>
    
    `;
};


/** @type {BasicElement} */
export const Controls =()=>
{
    const [State, Dispatch] = Store.Consumer();

    const [pulsedGet, pulsedSet] = React.useState(true);
    const [playGet, playSet] = React.useState(0);

    const errorsRef = React.useRef(0);

    React.useEffect(()=>
    {
        /** @type {number|undefined} */
        let timer;
        if(playGet == 1)
        {
            const volNorm = (State.Stim.Value-State.Stim.Min)/(State.Stim.Max-State.Stim.Min);
            !State.Mute && Tone.Play(!pulsedGet, State.Chan.Value, Store.ColumnMapping[State.Freq.Value][0], (volNorm*0.8) + 0.1);

            if(State.Live.Freq)
            {
                const audible = State.Stim.Value >= (State.Live.Mark.Test?.Stim??0);

                const errorScaled = State.Live.Mark.Errs;
                const errorSampled = Math.random() < errorScaled;
                if(errorSampled)
                {
                    //console.log("errored!")
                    errorsRef.current++;
                }
                const percieved = (errorSampled && errorsRef.current<3) ? !audible : audible;

                const handler = percieved ? ()=>playSet(2) : ()=>playSet(0);
                console.log("Audible:", audible, "Error Scaled:", errorScaled, "Error Sampled:", errorSampled, "Errors count:", errorsRef.current, "Percieved", percieved);
                timer = setTimeout(handler, 800 + Math.random()*1300);
            }
        }
        return () => clearTimeout(timer);
        
    }, [playGet]);

    React.useEffect(()=>
    {
        //console.log("resetting errors");
        errorsRef.current = 0;
    }, [State.Chan.Value, State.Freq.Value, State.Stim.Value]);

    const classTitle = "flex-1 text-sm"

    return html`
    <div class="grid grid-cols-6 gap-4 w-full lg:w-[370px]">

        <div class="col-start-1 col-end-7 md:col-end-4 lg:col-end-7  flex-col bg-metal rounded-lg overflow-hidden shadow-md">
            <p class="text(center shadow-emboss slate-900) uppercase font-bold py-2">Controls</p>
            <div class="border-y-1 border-t-slate-300 border-b-white"></div>
            <div class="p-2 pb-1">
                <div class="box-buttons min-w-[50%]">
                    <p class="text(sm ) mx-2">Channel</p>
                    <${Button} inactive=${State.Chan.Value == 0} light=${State.Chan.Value == 0} classes="flex-1 text-sm" onClick=${()=>Dispatch({Name:"Chan", Data:-1})}>Left<//>
                    <${Button} inactive=${State.Chan.Value == 1} light=${State.Chan.Value == 1} classes="flex-1 text-sm" onClick=${()=>Dispatch({Name:"Chan", Data:1})}>Right<//>
                </div>
            </div>
            <div class="p-2 py-1">
                <div class="box-buttons min-w-[50%]">
                    <div class="flex-1 text-center">
                        <p class="text-sm">Frequency <strong>${Store.ColumnMapping[State.Freq.Value][0]}</strong> (Hz) </p>
                    </div>
                    <${Button} disabled=${State.Freq.Value == State.Freq.Min} onClick=${()=>Dispatch({Name:"Freq", Data:-1})}>
                        <svg class="my-1 h-2 w-2 overflow-visible stroke(white 2)">
                            <${Glyph.Minus}/>
                        </svg>
                    <//>
                    <${Button} disabled=${State.Freq.Value == State.Freq.Max} onClick=${()=>Dispatch({Name:"Freq", Data:1})}>
                        <svg class="my-1 h-2 w-2 overflow-visible stroke(white 2)">
                            <${Glyph.Plus}/>
                        </svg>
                    <//>
                </div>
            </div>
            <div class="p-2 pt-2">
                <div class="box-buttons min-w-[50%]">
                    <div class="flex-1 text-center">
                        <p class="text-sm">Hearing Level <strong>${State.Stim.Value}</strong> (dBHL)</p>
                    </div>
                    <${Button} disabled=${State.Stim.Value == State.Stim.Min} onClick=${()=>Dispatch({Name:"Stim", Data:-1})}>
                    <svg class="my-1 h-2 w-2 overflow-visible stroke(white 2)">
                            <${Glyph.Minus}/>
                        </svg>
                    <//>
                    <${Button} disabled=${State.Stim.Value == State.Stim.Max} onClick=${()=>Dispatch({Name:"Stim", Data:1})}>
                        <svg class="my-1 h-2 w-2 overflow-visible stroke(white 2)">
                            <${Glyph.Plus}/>
                        </svg>
                    <//>
                </div>
            </div>
        </div>

        <div class="col-start-1 col-end-7 md:col-start-4 lg:col-start-1  flex-col bg-metal rounded-lg overflow-hidden shadow-md">
            <p class="text(center shadow-emboss slate-900) uppercase font-bold py-2">Tone</p>
            <div class="border-y-1 border-t-slate-300 border-b-white"></div>
            <div class="p-2">
                <div class="box-buttons flex-1">
                    <div class="flex-1">
                        <div class="flex gap-1 mb-2">
                            <${Button} onClick=${()=>{pulsedSet(true )}} light=${pulsedGet } inactive${pulsedGet } classes="flex-1 text(center xs)">Pulsed    <//>
                            <${Button} onClick=${()=>{pulsedSet(false)}} light=${!pulsedGet} inactive${!pulsedGet} classes="flex-1 text(center xs)">Continuous<//>
                        </div>
                        <div class="flex items-start">
                            <${Button}
                                classes="w-full flex-2"
                                onClick=${()=>playSet(1)}
                                disabled=${playGet==1}
                                icon=${html`<svg class="w-3 h-3 mx-1" viewBox="0 0 20 20">
                                    <polygon points="0,0 20,10 0,20" fill="#ffffff" stroke="none"></polygon>
                                </svg>`}
                            >
                                <span class="py-2 text-sm leading-none">Present Tone</span>
                            <//>
                        </div>
                        <div class="flex gap-1 mt-2">
                            <${Button} onClick=${()=>Dispatch({Name:"Mute", Data:true})}  light=${State.Mute } inactive${!State.Mute} classes="flex-1 text(center xs)">Silent    <//>
                            <${Button} onClick=${()=>Dispatch({Name:"Mute", Data:false})} light=${!State.Mute} inactive${State.Mute}  classes="flex-1 text(center xs)">Audible<//>
                        </div>
                    </div>
                    <div class="">
                        <p class="text(center sm shadow-emboss) mt-2 -mb-2 font-bold">Response:</p>
                        <svg width="80" height="80" preserveAspectRatio="none" viewBox="0 0 79 79" fill="none" class="mx-auto mt-2">
                            <circle fill="url(#metal)" cx="39" cy="40" r="35"></circle>
                            <circle fill="url(#metal)" cx="39.5" cy="39.5" r="29.5" transform="rotate(180 39.5 39.5)"></circle>
                            <circle fill="url(#metal)" cx="39" cy="40" r="27"></circle>
                            <circle fill="url(#backwall)" cx="39" cy="40" r="25"></circle>
                            <ellipse fill="url(#clearcoat)" cx="39" cy="33" rx="20" ry="16"></ellipse>
                            ${playGet == 2 && html`<circle fill="url(#light)" cx="39.5" cy="39.5" r="36" class="animate-pulse"></circle>`}
                            <defs>
                                <linearGradient id="metal" x1="39.5" y1="1" x2="39.5" y2="78" gradientUnits="userSpaceOnUse">
                                    <stop offset="0.0" stop-color="#C4C4C4" stop-opacity="1.0"></stop>
                                    <stop offset="1.0" stop-color="#F2F2F2" stop-opacity="1.0"></stop>
                                </linearGradient>
                                <radialGradient id="backwall" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(39 56) rotate(-90) scale(45.5 74.4907)">
                                    <stop offset="0.0" stop-color="#AAAAAA" stop-opacity="1.0"></stop>
                                    <stop offset="1.0" stop-color="#333333" stop-opacity="1.0"></stop>
                                </radialGradient>
                                <radialGradient id="clearcoat" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(39 38.5) rotate(90) scale(50.5 71.9394)">
                                    <stop offset="0.0" stop-color="#ffffff" stop-opacity="0.0"></stop>
                                    <stop offset="0.7" stop-color="#ffffff" stop-opacity="1.0"></stop>
                                </radialGradient>
                                <radialGradient id="light" cx="0" cy="0" r="1.0" gradientUnits="userSpaceOnUse" gradientTransform="translate(39.5 39.5) rotate(90) scale(39.5)">
                                    <stop offset="0.2" stop-color="#ffffff" stop-opacity="1.0"></stop>
                                    <stop offset="0.5" stop-color="#ff8800" stop-opacity="1.6"></stop>
                                    <stop offset="0.9" stop-color="#ffffff" stop-opacity="0.0"></stop>
                                </radialGradient>
                            </defs>
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-start-1 col-end-7  flex-col bg-metal rounded-lg overflow-hidden shadow-md">
            <p class="text(center shadow-emboss slate-900) uppercase font-bold py-2">Thresholds</p>
            <div class="border-y-1 border-t-slate-300 border-b-white"></div>
            <div class="p-2">
                <div class="box-buttons flex-col md:flex-row flex-wrap gap-2 items-stretch min-w-[50%]">
                    <${Button}
                        onClick=${()=>Dispatch({Name:"Mark", Data:true })}
                        classes="text-sm flex-1"
                        icon=${html`
                            <svg class="h-2 w-2 overflow-visible stroke(white 2)">
                                <${State.Chan.Value ? Glyph.O : Glyph.X}/>
                            </svg>`}
                    >
                        Accept
                    <//>
                    <${Button}
                        onClick=${()=>Dispatch({Name:"Mark", Data:null })}
                        classes="text-sm flex-1"
                        icon=${html`
                        <svg class="h-2 w-2 overflow-visible stroke(white 2)">
                            <${Glyph.Null}/>
                        </svg>
                        `}
                        disabled=${State.Live.Mark.User == undefined}
                    >
                        Clear
                    <//>
                    <${Button}
                        onClick=${()=>Dispatch({Name:"Mark", Data:false})}
                        classes="mt-1 text-xs flex-1 leading-none"
                        icon=${html`
                            <svg class="h-[6px] w-[6px] overflow-visible stroke(white 2)">
                                <${State.Chan.Value ? Glyph.O : Glyph.X}>
                                    <${Glyph.Arrow}/>
                                <//>
                            </svg>`}
                    >
                        No Response
                    <//>
                </div>
            </div>
        </div>
    </div>
    `;
};

/** @type {BasicElement} */
export const Audiogram =()=>
{
    const [State] = Store.Consumer();

    const testMarksL = State.Draw.TestL.Points.map(p=>html`<${Mark} x=${p.X} y=${p.Y} response=${p.Mark?.Resp} right=${false}/>`);
    const userMarksL = State.Draw.UserL.Points.map(p=>html`<${Mark} x=${p.X} y=${p.Y} response=${p.Mark?.Resp} right=${false} classes=${State.Live.Mark.User == p.Mark ? "stroke-bold":""}/>`);
    const testMarksR = State.Draw.TestR.Points.map(p=>html`<${Mark} x=${p.X} y=${p.Y} response=${p.Mark?.Resp} right=${true} />`);
    const userMarksR = State.Draw.UserR.Points.map(p=>html`<${Mark} x=${p.X} y=${p.Y} response=${p.Mark?.Resp} right=${true} classes=${State.Live.Mark.User == p.Mark ? "stroke-bold":""}/>`);

    const testLinesL = State.Draw.TestL.Paths.map( p=>html`<line class="opacity-60" x1=${p.Head.X} y1=${p.Head.Y} x2=${p.Tail.X} y2=${p.Tail.Y} />`);
    const userLinesL = State.Draw.UserL.Paths.map( p=>html`<line class="opacity-60" x1=${p.Head.X} y1=${p.Head.Y} x2=${p.Tail.X} y2=${p.Tail.Y} />`);
    const testLinesR = State.Draw.TestR.Paths.map( p=>html`<line class="opacity-60" x1=${p.Head.X} y1=${p.Head.Y} x2=${p.Tail.X} y2=${p.Tail.Y} />`);
    const userLinesR = State.Draw.UserR.Paths.map( p=>html`<line class="opacity-60" x1=${p.Head.X} y1=${p.Head.Y} x2=${p.Tail.X} y2=${p.Tail.Y} />`);

    return html`
    ${
        State.Show.Answer && html`
        <svg class="absolute top-0 w-full h-full overflow-visible stroke(blue-700 bold draw) opacity-50">${testMarksL}${testLinesL}</svg>
        <svg class="absolute top-0 w-full h-full overflow-visible stroke(red-700 bold draw)  opacity-50">${testMarksR}${testLinesR}</svg>
        `
    }
    <svg class="absolute top-0 w-full h-full overflow-visible stroke(blue-700 2 draw)">${userMarksL}${userLinesL}</svg>
    <svg class="absolute top-0 w-full h-full overflow-visible stroke(red-700 2 draw)">${userMarksR}${userLinesR}</svg>
    ${
        State.Show.Cursor && html`
        <svg class="absolute top-0 w-1 h-1 overflow-visible transition-all duration-500" style=${{top:State.Draw.Cross?.Y, left:State.Draw.Cross?.X}}>
            <ellipse cx="0" cy="0" rx="5" ry="30" fill="url(#glow)"></ellipse>
            <ellipse cx="0" cy="0" rx="30" ry="5" fill="url(#glow)"></ellipse>
            <defs>
                <radialGradient id="glow">
                    <stop stop-color=${State.Chan.Value ? "red" : "blue"} stop-opacity="0.6" offset="0.0"></stop>
                    <stop stop-color=${State.Chan.Value ? "red" : "blue"} stop-opacity="0.3" offset="0.2"></stop>
                    <stop stop-color=${State.Chan.Value ? "red" : "blue"} stop-opacity="0.0" offset="1.0"></stop>
                </radialGradient>
            </defs>
        </svg>`
    }`;
};


/** @type {BasicElement} */
export function Chart({children})
{
    const [State] = Store.Consumer();
    const inset = 20;
    /** @type {Array<preact.VNode>} */
    const rules = [];
    Store.ColumnMapping.forEach(([label, position, normal])=>
    {
        rules.push(html`
        <span class="block absolute top-[-${inset}px] left-[${position*100}%] w-0 h-[calc(100%+${inset*2}px)] border-r(1 zinc-400) ${!normal && "border-dashed"}">
            <span class="block absolute top-0 left-0 -translate-x-1/2 -translate-y-full pb-${normal ? 4 : 1}">${label}</span>
        </span>`
        );
    });

    for(let db = State.Stim.Min; db <= State.Stim.Max; db+=10)
    {
        rules.push(html`
        <span class="block absolute  left-[-${inset}px]   top-[${((db-State.Stim.Min) / (State.Stim.Max-State.Stim.Min))*100}%]   h-0 w-[calc(100%+${inset*2}px)] border-b(${db == 0 ? "2 black" : "1 zinc-400"})">
            <span class="block absolute top-0 left-0 -translate-x-full -translate-y-1/2 pr-2">${db}</span>
        </span>`
        );
    }
    return html`
    <div class="relative w-full pb-[calc(90%+70px)] md:pb-[calc(65%+70px)] lg:pb-[calc(45%+70px)] font(sans medium) text(xs) self-start">
        <div class="absolute right-0 bottom-0 w-[calc(100%-80px)] h-[calc(100%-70px)] border(1 zinc-300)">
            <span class="block        absolute top-[-65px] left-0  w-full      text(sm center)     font-black">Frequency (Hz)</span>
            <span class="inline-block absolute top-[50%]   left-[-50px] ">
                <span class="inline-block -rotate-90 origin-top -translate-x-1/2 text(sm center) font-black">
                    Hearing Level (dBHL)
                </span>
            </span>
            <div class=${`relative top-[${inset}px] left-[${inset}px] w-[calc(100%-${inset*2}px)] h-[calc(100%-${inset*2}px)]`}>
                <span class="block absolute top-0 left-[-${inset}px] w-[calc(100%+${inset*2}px)] h-[27%] bg-black opacity-5"></span>
                ${ rules }
                <div class="absolute top-0 left-0 w-full h-full">
                    ${ children }
                </div>
            </div>
        </div>
    </div>`;
}

/** @type {Record<string, BasicElement>} */
export const Glyph = {
    Arrow:()=> html`
    <line class="stroke-draw" x1="100%" y1="100%" x2="0%"   y2="0%"  ></line>
    <line class="stroke-draw" x1="100%" y1="100%" x2="25%"  y2="100%"></line>
    <line class="stroke-draw" x1="100%" y1="100%" x2="100%" y2="25%" ></line>`,

    X: ({children})=> html`
    <line class="stroke-draw" x1="0%" y1="0%"   x2="100%" y2="100%"></line>
    <line class="stroke-draw" x1="0%" y1="100%" x2="100%" y2="0%"  ></line>
    <g class="scale-50 translate(x-full y-full) rotate-[-15deg]">${children}</g>`,

    O: ({children})=> html`
    <ellipse class="stroke-draw" cx="50%" cy="50%" rx="60%" ry="60%"></ellipse>
    <g class="scale-50 rotate-[96deg] translate(-x-[0%] y-full)">${children}</g>`,

    Minus:()=>html` <line class="stroke-draw" x1="0%" y1="50%" x2="100%" y2="50%"></line>`,
    Plus:()=>html`  <line class="stroke-draw" x1="0%" y1="50%" x2="100%" y2="50%"></line>
                    <line class="stroke-draw" y1="0%" x1="50%" y2="100%" x2="50%"></line>`,

    Null:()=>html`
        <ellipse class="stroke-draw" cx="50%" cy="50%" rx="70%" ry="70%"></ellipse>
        <line    class="stroke-draw" x1="0%" y1="0%" x2="100%" y2="100%"></line>
    `

};

/** @type {({right, response, x, y, classes}:{right:boolean, response?:boolean, x:number|string, y:number|string, classes:string})=>preact.VNode} */
export const Mark =({right, response, x, y, classes})=>
{
    return html`
    <svg x=${x} y=${y} width="20" height="20" class="overflow-visible ${classes}">
        <g class="translate(-x-1/2 -y-1/2)">
            <${ right ? Glyph.O : Glyph.X }>
                ${ !response && html`<${Glyph.Arrow}/>` }
            <//>
        </g>
    </svg>`;
};