<table>
<tr>
    <td colspan="2">Hi {{$demo->firstName}},</td>
</tr>
<tr><td>&nbsp;</td></tr>
<tr>
    <td colspan="2">I saw that you just started your TerriTool trial and wanted to introduce myself. I&rsquo;ll be your main point of contact while you explore the platform &mdash; happy to help however I can.</td>
</tr>
<tr><td>&nbsp;</td></tr>
<tr>
    <td colspan="2">A lot of field reps like you have found it useful to go through a live walkthrough during their trial. I&rsquo;d be happy to set that up for you. Would {{$demo->dayOne}} or {{$demo->dayTwo}} work to connect for a few minutes?</td>
</tr>
<tr><td>&nbsp;</td></tr>
<tr>
    <td colspan="2">Looking forward to hearing how your territory is shaping up.</td>
</tr>
<tr><td>&nbsp;</td></tr>
<tr>
    <td colspan="2">--</td>
</tr>
<tr>
    <td colspan="2">
        <img src="{{ config('app.url') }}images/logo_blue.png" alt="TerriTool" style="max-width:160px;height:auto;display:block;margin-bottom:12px;" />
        Spencer Kelleher<br/>
        Co Founder | TerriTool AI<br/>
        Book time <a href="{{$demo->bookTimeUrl}}">here</a>
    </td>
</tr>
</table>
