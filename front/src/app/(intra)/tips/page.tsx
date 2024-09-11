'use client';

import React, { useEffect, useState } from "react";
import { Accordion, AccordionTab } from 'primereact/accordion';

import GetTipsService from '@/app/services/tips/get-tips'
import { Tip } from '@/app/types/Tip'

const getTipsService = new GetTipsService()

export default function Tips() {
    const [tips, setTips] = useState<Tip[]>([])

    useEffect(() => {
        const getTips = async () => {
            try {
                setTips(await getTipsService.getTips())
            } catch (error) { }
        }
        getTips()
    }, []);

    return (
        <div>
            <div className="text-4xl font-light mt-6 ml-6"> Tips for Coaches </div>
            <TipsAccordion tips={tips}/>
        </div>
    )
}

function TipsAccordion({ tips }: { tips: Tip[] }) {
    const tipsList = tips.map((tip, index) => (
        <AccordionTab key={index} header={tip.title}>
            <p className="m-0">
                {tip.tip}
            </p>
        </AccordionTab>
    ))

    return (
        <div className="p-10">
            <Accordion multiple activeIndex={[0]}>
                {tipsList}
            </Accordion>
        </div>
    )
}
