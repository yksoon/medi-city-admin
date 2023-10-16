import { forwardRef } from "react";

const ProfileInfoComponent = forwardRef((props, ref) => {
    const userData = props.userData;

    return (
        <>
            <div className="kmedi_member_box">
                <div className="kmedi_member_sub">
                    <h5>프로필 정보</h5>
                    <div>
                        <div data-v-81935dc4="" className="author-section">
                            <div data-v-81935dc4="" className="author-name">
                                Direktur{" "}
                                {`${
                                    userData.user_name_first_en
                                        ? userData.user_name_first_en
                                        : userData.user_name_first_ko
                                } ${
                                    userData.user_name_last_en
                                        ? userData.user_name_last_en
                                        : userData.user_name_last_ko
                                }`}
                            </div>
                            <div data-v-81935dc4="" className="author-category">
                                {" "}
                                Bidang Medis :
                                <br data-v-81935dc4="" />{" "}
                                {userData.organization_name_en
                                    ? userData.organization_name_en
                                    : userData.organization_name_ko
                                    ? userData.organization_name_ko
                                    : "-"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

export default ProfileInfoComponent;
