"use client";

import Script from "next/script";
import {usePathname, useSearchParams} from "next/navigation";
import {useEffect} from "react";
import { pageview } from "@/utils/gtagHelper";

export default function GoogleAnalytics({GA_MEASUREMENT_ID}: { GA_MEASUREMENT_ID: string }) {

    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // tu lógica aquí
      
  
        const url = pathname + (searchParams ?? "").toString();
        pageview(GA_MEASUREMENT_ID, url);
    },  [GA_MEASUREMENT_ID, pathname, searchParams]);


    return (
        <>
            <Script strategy={"afterInteractive"}
                    src={`https://googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}/>
            <Script id={'google-analytics'} strategy={"afterInteractive"}
                    dangerouslySetInnerHTML={{
                        __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        
                        gtag('consent', 'default', {
                            'analytics_storage': 'denied'
                        });
                        
                        gtag('config', '${GA_MEASUREMENT_ID}', {
                            page_path: window.location.pathname,
                        });
                        `,
                    }}/>
            <Script id={'google-tag-manager'} strategy={"afterInteractive"}
                    dangerouslySetInnerHTML={{
                        __html: `
                        (function(w,d,s,l,i){
                            w[l]=w[l]||[];
                            w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
                            var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
                            j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                            f.parentNode.insertBefore(j,f);
                        })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
                        `
                    }}/>
        </>
    );
}