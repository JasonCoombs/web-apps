import React, { Fragment } from 'react';
import { observer, inject } from "mobx-react";
import { Page, Navbar, Link } from "framework7-react";
import { useTranslation } from "react-i18next";

const PageSpreadsheetAbout = props => {
    const { t } = useTranslation();
    const _t = t("View.Settings", { returnObjects: true });
    const storeAppOptions = props.storeAppOptions;
    const isCanBranding = storeAppOptions.canBranding;
    const licInfo = isCanBranding ? storeAppOptions.customization : null;
    const customer = licInfo ? licInfo.customer : null;
    const nameCustomer = customer ? customer.name : null;
    const mailCustomer = customer ? customer.mail : null;
    const addressCustomer = customer ? customer.address : null;
    const urlCustomer = customer ? customer.www : null;
    const infoCustomer = customer ? customer.info : null;
    const logoCustomer = customer ? customer.logo : null;

    // console.log(storeAppOptions);
    // console.log(isCanBranding);

    return (
        <Page className="about">
            <Navbar title={_t.textAbout} backLink={_t.textBack} />
            {licInfo && typeof licInfo == 'object' && typeof(customer) == 'object' ? 
                <Fragment>
                    <div className="content-block">
                        {/* {licInfo && typeof licInfo == 'object' && typeof(customer) == 'object' ? null : (
                            <i className="logo"></i>
                        )} */}
                        {logoCustomer && logoCustomer.length ? (
                            <div id="settings-about-logo" className="settings-about-logo">
                                <img src={logoCustomer} />
                            </div>
                        ) : null}
                    </div>
                    <div className="content-block">
                        <h3>SPREADSHEET EDITOR</h3>
                        <h3>{_t.textVersion} 6.1.1</h3>
                    </div>
                    <div className="content-block">
                        {nameCustomer && nameCustomer.length ? (
                            <h3 id="settings-about-name" className="vendor">{nameCustomer}</h3>
                        ) : null}
                        {addressCustomer && addressCustomer.length ? (
                            <p>
                                <label>{_t.textAddress}</label>
                                <Link id="settings-about-address" className="external">{addressCustomer}</Link>
                            </p>
                        ) : null}
                        {mailCustomer && mailCustomer.length ? (
                            <p>
                                <label>{_t.textEmail}</label>
                                <Link id="settings-about-email" className="external" target="_blank" href={"mailto:"+mailCustomer}>{mailCustomer}</Link>
                            </p>
                        ) : null}
                        <p>
                            <label>{_t.textTel}</label>
                            <Link id="settings-about-tel" className="external" target="_blank" href="tel:+37163399867">+371 633-99867</Link>
                        </p>
                        {urlCustomer && urlCustomer.length ? (
                            <p>
                                <Link id="settings-about-url" className="external" target="_blank" 
                                    href={!/^https?:\/{2}/i.test(urlCustomer) ? "http:\/\/" : '' + urlCustomer}>
                                    {urlCustomer}
                                </Link>
                            </p>
                        ) : null} 
                        {infoCustomer && infoCustomer.length ? (
                            <p>
                                <label id="settings-about-info">{infoCustomer}</label>
                            </p>
                        ) : null}
                    </div>
                    <div className="content-block" id="settings-about-licensor">
                        <div className="content-block-inner"></div>
                        <p>
                            <label>{_t.textPoweredBy}</label>
                        </p>
                        <h3 className="vendor">Ascensio System SIA</h3>
                        <p>
                            <Link className="external" target="_blank" href="www.onlyoffice.com">www.onlyoffice.com</Link>
                        </p>
                    </div>
                </Fragment> :
                <Fragment>
                    <div className="content-block">
                        <i className="logo"></i>
                    </div>
                </Fragment>}
        </Page>
    );
};

const SpreadsheetAbout = inject("storeAppOptions")(observer(PageSpreadsheetAbout));

export default SpreadsheetAbout;